"""empty message

Revision ID: 8e3464ef8c40
Revises: 
Create Date: 2024-06-17 10:44:00.247177

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8e3464ef8c40'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('exercises',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('category', sa.String(), nullable=True),
    sa.Column('group', sa.String(), nullable=False),
    sa.Column('calories', sa.Integer(), nullable=False),
    sa.Column('difficulty_level', sa.String(), nullable=False),
    sa.Column('duration', sa.Integer(), nullable=True),
    sa.Column('exercise_image_url', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('description'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('weight', sa.Float(), nullable=True),
    sa.Column('height', sa.Float(), nullable=True),
    sa.Column('profile_picture', sa.String(), nullable=True),
    sa.Column('birth_date', sa.Date(), nullable=True),
    sa.Column('gender', sa.String(), nullable=True),
    sa.Column('registration_date', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('profile_picture')
    )
    op.create_table('favorites',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('exercise_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['exercise_id'], ['exercises.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('workouts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('difficulty_level', sa.String(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('start_date', sa.Date(), nullable=True),
    sa.Column('ending_date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('activity_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('workout_id', sa.Integer(), nullable=True),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('duration', sa.Integer(), nullable=False),
    sa.Column('calories', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['workout_id'], ['workouts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('workout_details',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('workout_id', sa.Integer(), nullable=True),
    sa.Column('exercise_id', sa.Integer(), nullable=True),
    sa.Column('reps_num', sa.Integer(), nullable=False),
    sa.Column('series_num', sa.Integer(), nullable=False),
    sa.Column('rest_seconds', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['exercise_id'], ['exercises.id'], ),
    sa.ForeignKeyConstraint(['workout_id'], ['workouts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('workout_details')
    op.drop_table('activity_logs')
    op.drop_table('workouts')
    op.drop_table('favorites')
    op.drop_table('users')
    op.drop_table('exercises')
    # ### end Alembic commands ###
