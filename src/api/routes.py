from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import (
    db,
    Users,
    Exercises,
    Workouts,
    WorkoutDetails,
    Favorites,
    ActivityLogs,
)
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
import requests

api = Blueprint("api", __name__)
CORS(api)  # Allow CORS requests to this API


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Lógica de validación de usuario y contraseña
    user = db.session.execute(
        db.select(Users).where(
            Users.email == email, Users.password == password, Users.is_active == True
        )
    ).scalar()
    if user:
        access_token = create_access_token(identity={"user_id": user.id})
        response_body["message"] = "Usuario logueado"
        response_body["access_token"] = access_token
        response_body["results"] = user.serialize()
        return response_body, 200
    
    response_body["message"] = "Usuario y/o contraseña incorrecta"
    return response_body, 401

@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    response_body["message"] = f"User logueado: {current_user}"
    return response_body, 200

@api.route("/signup", methods=["POST"])
def signup():
    response_body = {}
    email = request.json.get("email", None).lower()
    password = request.json.get("password", None)
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name", None)
    weight = request.json.get("weight", None)
    height = request.json.get("height", None)
    profile_picture = request.json.get("profile_picture", None)
    birth_date = request.json.get("birth_date", None)
    gender = request.json.get("gender", None)
    registration_date = request.json.get("registration_date", None)
    existing_user = Users.query.filter_by(email=email).first()
    if existing_user:
        response_body["message"] = "El usuario ya existe"
        return response_body, 409

    # Lógica de verificación de email y password válidos
    user = Users(
        email=email,
        password=password,
        is_active=True,
        first_name=first_name,
        last_name=last_name,
        weight=weight,
        height=height,
        profile_picture=profile_picture,
        birth_date=birth_date,
        gender=gender,
        registration_date=registration_date
    )
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity={"user_id": user.id})
    response_body["message"] = "Usuario registrado y logueado"
    response_body["access_token"] = access_token
    response_body["results"] = user.serialize()
    return response_body, 200

@api.route("/users", methods=["GET", "POST"])
def users():
    response_body = {}
    if request.method == "GET":
        users = db.session.execute(db.select(Users)).scalars()
        results = [row.serialize() for row in users]
        response_body["results"] = results
        response_body["message"] = "Listado de usuarios"
        return response_body, 200
    
    if request.method == "POST":
        response_body["message"] = "Este endpoint no es válido, primero haz un signup"
        return response_body, 200

@api.route("/users/<int:id>", methods=["GET", "PUT", "DELETE"])
def user(id):
    response_body = {}
    if request.method == "GET":
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
        if user:
            response_body["results"] = user.serialize()
            response_body["message"] = "Usuario encontrado"
            return response_body, 200
        response_body["message"] = "Usuario no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
        if user:
            user.email = data["email"]
            user.is_active = data["is_active"]
            user.first_name = data["first_name"]
            user.last_name = data["last_name"]
            user.weight = data["weight"]
            user.height = data["height"]
            user.birth_date = data["birth_date"]
            user.gender = data["gender"]
            db.session.commit()
            response_body["message"] = "Datos del usuario actualizados"
            response_body["results"] = user.serialize()
            return response_body, 200
        response_body["message"] = "Usuario no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
        if user:
            db.session.delete(user)
            db.session.commit()
            response_body["message"] = "Usuario eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Usuario no existe"
        response_body["results"] = {}
        return response_body, 404
    

RAPIDAPI_KEY = "f335c9d4a1mshf5aa931e8c58f0ep101b9djsn062339dbf8b5"
RAPIDAPI_HOST = "exercisedb.p.rapidapi.com"
@api.route("/exercises", methods=["GET", "POST"])
def exercises():
    response_body = {}
    if request.method == "GET":
        try:
            exercises = db.session.execute(db.select(Exercises)).scalars()
            results = [row.serialize() for row in exercises]
            response_body["results"] = results
            response_body["message"] = "Listado de ejercicios"
            return jsonify(response_body), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    if request.method == "POST":
        try:
            headers = {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": RAPIDAPI_HOST
            }
            api_url = "https://exercisedb.p.rapidapi.com/exercises?limit=2000&offset=0"
            external_response = requests.get(api_url, headers=headers)
            if external_response.status_code != 200:
                return jsonify({"error": "Error al obtener datos de la API externa"}), 500
            external_data = external_response.json()
            for data in external_data:
                new_exercise = Exercises(
                    name=data.get("name"),
                    target=data.get("target"),
                    body_part=data.get("bodyPart"),
                    equipment=data.get("equipment"),
                    secondary_muscles=data.get("secondaryMuscles", ""),
                    instructions=data.get("instructions", ""),
                    gif_url=data.get("gifUrl"),
                )
                db.session.add(new_exercise)
            db.session.commit()
            response_body["message"] = "Ejercicios creados"
            return jsonify(response_body), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400


@api.route("/exercises/<int:id>", methods=["GET", "PUT", "DELETE"])
def exercise(id):
    response_body = {}
    if request.method == "GET":
        exercise = db.session.execute(
            db.select(Exercises).where(Exercises.id == id)
        ).scalar()
        if exercise:
            response_body["results"] = exercise.serialize()
            response_body["message"] = "Ejercicio encontrado"
            return response_body, 200
        response_body["message"] = "Ejercicio no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        exercise = db.session.execute(
            db.select(Exercises).where(Exercises.id == id)
        ).scalar()
        if exercise:
            exercise.name = data.get("name", exercise.name)
            exercise.target = data.get("target", exercise.target)  
            exercise.body_part = data.get("body_part", exercise.body_part)  
            exercise.equipment = data.get("equipment", exercise.equipment)
            exercise.secondary_muscles = data.get("secondary_muscles", exercise.secondary_muscles)
            exercise.instructions = data.get("instructions", exercise.instructions)
            exercise.gif_url = data.get("gif_url", exercise.gif_url)
            db.session.commit()
            response_body["message"] = "Ejercicio actualizado"
            response_body["results"] = exercise.serialize()
            return response_body, 200
        response_body["message"] = "Ejercicio no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        exercise = db.session.execute(
            db.select(Exercises).where(Exercises.id == id)
        ).scalar()
        if exercise:
            db.session.delete(exercise)
            db.session.commit()
            response_body["message"] = "Ejercicio eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Ejercicio no existe"
        response_body["results"] = {}
        return response_body, 404

@api.route("/workouts", methods=["GET"])
def workouts():
    response_body = {}
    if request.method == "GET":
        workouts = db.session.execute(db.select(Workouts)).scalars()
        results = [row.serialize() for row in workouts]
        response_body["results"] = results
        response_body["message"] = "Listado de rutinas"
        return response_body, 200


@api.route('/workouts', methods=['POST'])
def add_workout():
    data = request.json
    new_workout = Workouts(
        user_id = data['userId'],
        name = data['routineName'],
        duration = data['totalDuration']
    )
    db.session.add(new_workout)
    db.session.commit()
    
    # Añadir detalles del workout
    exercises = data.get('exercises', [])
    for exercise in exercises:
        workout_detail = WorkoutDetails(
            workout_id=new_workout.id,
            exercise_id=exercise['exercise_id'],
            reps_num=exercise['reps_num'],
            series_num=exercise['series_num'],
            rest_seconds=exercise.get('rest_seconds', 0)
        )
        db.session.add(workout_detail)
    
    db.session.commit()
    response_body = {
        "results": new_workout.serialize(),
        "message": "Workout created successfully"
    }
    return response_body, 201

@api.route("/workouts/<int:id>", methods=["GET", "PUT", "DELETE"])
def workout(id):
    response_body = {}
    if request.method == "GET":
        workout = db.session.execute(
            db.select(Workouts).where(Workouts.id == id)
        ).scalar()
        if workout:
            response_body["results"] = workout.serialize()
            response_body["message"] = "Rutina encontrada"
            return response_body, 200
        response_body["message"] = "Rutina no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        workout = db.session.execute(
            db.select(Workouts).where(Workouts.id == id)
        ).scalar()
        if workout:
            workout.name = data.get("name", workout.name)
            workout.is_active = data.get("is_active", workout.is_active)
            workout.user_id = data.get("user_id", workout.user_id)
            workout.start_date = data.get("start_date", workout.start_date)
            workout.ending_date = data.get("ending_date", workout.ending_date)
            db.session.commit()
            response_body["message"] = "Rutina actualizada"
            response_body["results"] = workout.serialize()
            return response_body, 200
        response_body["message"] = "Rutina no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        workout = db.session.execute(
            db.select(Workouts).where(Workouts.id == id)
        ).scalar()
        if workout:
            db.session.delete(workout)
            db.session.commit()
            response_body["message"] = "Rutina eliminada"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Rutina no existe"
        response_body["results"] = {}
        return response_body, 404


app = Flask(__name__)
CORS(app)

@api.route("/workoutdetails", methods=["POST"])
def add_workout_detail():
    data = request.json
    

    # Agregar detalles de la rutina
    workout_details = data['exercises']
    for detail in workout_details:
        new_detail = WorkoutDetails(
            workout_id=workout_id,
            exercise_id=detail['exercise_id'],
            reps_num=detail['reps_num'],
            series_num=detail['series_num'],
            rest_seconds=detail['rest_seconds']
        )
        db.session.add(new_detail)
    db.session.commit()

    return jsonify({"message": "Workout and details added successfully", "id": workout_id}), 201

if __name__ == '__main__':
    app.run(debug=True)

@api.route("/workoutdetails/<int:id>", methods=["GET", "PUT", "DELETE"])
def workoutdetail(id):
    response_body = {}
    if request.method == "GET":
        workoutdetails = db.session.execute(
            db.select(WorkoutDetails).where(WorkoutDetails.workout_id == id)
        ).scalars().all()

        if workoutdetails:
            results = []
            for detail in workoutdetails:
                exercise = db.session.execute(
                    db.select(Exercises).where(Exercises.id == detail.exercise_id)
                ).scalar()
                
                if exercise:
                    workout_detail_with_exercise = {
                        "id": detail.id,
                        "workout_id": detail.workout_id,
                        "exercise_id": detail.exercise_id,
                        "reps_num": detail.reps_num,
                        "rest_seconds": detail.rest_seconds,
                        "series_num": detail.series_num,
                        "exercise_name": exercise.name,
                        "exercise_gif": exercise.gif_url
                    }
                    results.append(workout_detail_with_exercise)
            
            response_body["results"] = results
            response_body["message"] = "Detalles del workout encontrados"
            return jsonify(response_body), 200

        response_body["message"] = "Detalles del workout no existen"
        response_body["results"] = {}
        return jsonify(response_body), 404

    if request.method == "PUT":
        data = request.json
        workoutdetail = db.session.execute(
            db.select(WorkoutDetails).where(WorkoutDetails.id == id)
        ).scalar()
        if workoutdetail:
            workoutdetail.workout_id = data.get(
                "workout_id", workoutdetail.workout_id
            )
            workoutdetail.exercise_id = data.get(
                "exercise_id", workoutdetail.exercise_id
            )
            workoutdetail.reps_num = data.get(
                "reps_num", workoutdetail.reps_num
            )
            workoutdetail.series_num = data.get("series_num", workoutdetail.series_num)
            workoutdetail.rest_seconds = data.get("rest_seconds", workoutdetail.rest_seconds)
            db.session.commit()
            response_body["message"] = "Detalle de rutina actualizado"
            response_body["results"] = workoutdetail.serialize()
            return jsonify(response_body), 200
        response_body["message"] = "Detalle de rutina no existe"
        response_body["results"] = {}
        return jsonify(response_body), 404
    
    if request.method == "DELETE":
        workoutdetail = db.session.execute(
            db.select(WorkoutDetails).where(WorkoutDetails.id == id)
        ).scalar()
        if workoutdetail:
            db.session.delete(workoutdetail)
            db.session.commit()
            response_body["message"] = "Detalle de rutina eliminado"
            response_body["results"] = {}
            return jsonify(response_body), 200
        response_body["message"] = "Detalle de rutina no existe"
        response_body["results"] = {}
        return jsonify(response_body), 404

@api.route("/favorites", methods=["GET", "POST"])
def favorites():
    response_body = {}
    if request.method == "GET":
        favorites = db.session.execute(db.select(Favorites)).scalars()
        results = [row.serialize() for row in favorites]
        response_body["results"] = results
        response_body["message"] = "Listado de favoritos"
        return response_body, 200
    
    if request.method == "POST":
        data = request.json
        new_favorite = Favorites(
            user_id=data.get("user_id"),
            exercise_id=data.get("exercise_id"),
        )
        db.session.add(new_favorite)
        db.session.commit()
        response_body["message"] = "Favorito creado"
        response_body["results"] = new_favorite.serialize()
        return response_body, 201

@api.route("/favorites/<int:id>", methods=["GET", "DELETE"])
def favorite(id):
    response_body = {}
    if request.method == "GET":
        favorite = db.session.execute(
            db.select(Favorites).where(Favorites.id == id)
        ).scalar()
        if favorite:
            response_body["results"] = favorite.serialize()
            response_body["message"] = "Favorito encontrado"
            return response_body, 200
        response_body["message"] = "Favorito no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        favorite = db.session.execute(
            db.select(Favorites).where(Favorites.id == id)
        ).scalar()
        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            response_body["message"] = "Favorito eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Favorito no existe"
        response_body["results"] = {}
        return response_body, 404

@api.route("/activitylogs", methods=["GET", "POST"])
def activitylogs():
    response_body = {}
    if request.method == "GET":
        activitylogs = db.session.execute(db.select(ActivityLogs)).scalars()
        results = [row.serialize() for row in activitylogs]
        response_body["results"] = results
        response_body["message"] = "Listado de logs de actividades"
        return response_body, 200
    
    if request.method == "POST":
        data = request.json
        new_activitylog = ActivityLogs(
            user_id=data.get("user_id"),
            workout_id=data.get("workout_id"),
            timestamp=data.get("timestamp"),
            status=data.get("status"),
        )
        db.session.add(new_activitylog)
        db.session.commit()
        response_body["message"] = "Log de actividad creado"
        response_body["results"] = new_activitylog.serialize()
        return response_body, 201

@api.route("/activitylogs/<int:id>", methods=["GET", "PUT", "DELETE"])
def activitylog(id):
    response_body = {}
    if request.method == "GET":
        activitylog = db.session.execute(
            db.select(ActivityLogs).where(ActivityLogs.id == id)
        ).scalar()
        if activitylog:
            response_body["results"] = activitylog.serialize()
            response_body["message"] = "Log de actividad encontrado"
            return response_body, 200
        response_body["message"] = "Log de actividad no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "PUT":
        data = request.json
        activitylog = db.session.execute(
            db.select(ActivityLogs).where(ActivityLogs.id == id)
        ).scalar()
        if activitylog:
            activitylog.user_id = data.get("user_id", activitylog.user_id)
            activitylog.workout_id = data.get("workout_id", activitylog.workout_id)
            activitylog.timestamp = data.get("timestamp", activitylog.timestamp)
            activitylog.status = data.get("status", activitylog.status)
            db.session.commit()
            response_body["message"] = "Log de actividad actualizado"
            response_body["results"] = activitylog.serialize()
            return response_body, 200
        response_body["message"] = "Log de actividad no existe"
        response_body["results"] = {}
        return response_body, 404
    
    if request.method == "DELETE":
        activitylog = db.session.execute(
            db.select(ActivityLogs).where(ActivityLogs.id == id)
        ).scalar()
        if activitylog:
            db.session.delete(activitylog)
            db.session.commit()
            response_body["message"] = "Log de actividad eliminado"
            response_body["results"] = {}
            return response_body, 200
        response_body["message"] = "Log de actividad no existe"
        response_body["results"] = {}
        return response_body, 404