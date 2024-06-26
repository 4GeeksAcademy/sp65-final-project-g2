import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Users, Exercises, Workouts, WorkoutDetails, Favorites, ActivityLogs


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    admin.add_view(ModelView(Users, db.session))  # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Exercises, db.session))
    admin.add_view(ModelView(Workouts, db.session))
    admin.add_view(ModelView(WorkoutDetails, db.session))
    admin.add_view(ModelView(Favorites, db.session))
    admin.add_view(ModelView(ActivityLogs, db.session))
