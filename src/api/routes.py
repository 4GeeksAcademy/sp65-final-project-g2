"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Exercises, Workouts, WorkoutDetails, Favorites, ActivityLogs
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from datetime import datetime


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Lógica de validación de usuario y contraseña
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active == True)).scalar()
    if user:
        access_token = create_access_token(identity = {"user_id" : user.id})
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
    response_body['message'] = f'User logueado: {current_user}'
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
    user = Users()
    user.email = email
    user.password = password
    user.is_active = True
    user.first_name = first_name
    user.last_name = last_name
    user.weight = weight
    user.height = height
    user.profile_picture = profile_picture
    user.birth_date = birth_date
    user.gender = gender
    user.registration_date = registration_date
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity = {"user_id" : user.id})
    response_body["message"] = "Usuario registrado y logueado"
    response_body["access_token"] = access_token
    return response_body, 200
    

@api.route('/users', methods=['GET','POST'])
def usersall():
    response_body = {}
    if request.method == 'GET':
        users = db.session.execute(db.select(Users)).scalars()
        results = [row.serialize() for row in users]
        response_body['results'] = results
        response_body['message'] = 'Listado de usuarios'
        return response_body, 200
    if request.method == 'POST':
        response_body['message'] = 'Este endpoint no es válido, primero haz un signup'
        return response_body, 200

@api.route('/users/<int:id>', methods=['GET','PUT','DELETE'])
def userone(id):
    response_body = {}
    if request.method == 'GET':
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
        if user:
            response_body['results'] = user.serialize()
            response_body['message'] = 'Usuario encontrado'
            return response_body, 200
        response_body['message'] = 'Usuario no existe'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'PUT':
        data = request.json
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
        if user:
            user.email = data['email']
            user.is_active = data['is_active']
            user.first_name = data['first_name']
            user.last_name = data['last_name']
            db.session.commit()
            response_body['message'] = 'Datos del usuario actualizados'
            response_body['results'] = user.serialize()
            return response_body, 200
        response_body['message'] = 'Usuario no existe'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'DELETE':
        user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if user:
        db.session.delete(user)
        db.session.commit()
        response_body['message'] = 'Usuario eliminado'
        response_body['results'] = {}
        return response_body, 200
        response_body['message'] = 'Usuario no existe'
        response_body['results'] = {}
        return response_body, 404

  
    





