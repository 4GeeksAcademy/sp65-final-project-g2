const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            isLogin: false,
            user: '',
            exercises: [],
            exercisesLoading: false,
            favorites: []
        },
        actions: {
            fetchExercises: async () => {
                try {
                    const store = getStore();
                    // Verificar si los ejercicios ya están cargados en el estado local
                    if (store.exercises.length > 0) {
                        console.log('Exercises already fetched.');
                        return;
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/exercises/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-rapidapi-key': 'f335c9d4a1mshf5aa931e8c58f0ep101b9djsn062339dbf8b5',
                            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
                        },
                        body: JSON.stringify({ limit: 2000, offset: 0 })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    setStore({ exercises: data });
                } catch (error) {
                    console.error('Error fetching exercises:', error);
                }
            },

            setIsLogin: (login) => { setStore({ isLogin: login }) },

            setCurrentUser: (user) => { setStore({ user: user }) },

            profile: async () => {
                const token = localStorage.getItem('token');
                const url = `${process.env.BACKEND_URL}/api/profile`;
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
                try {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        console.log('Error: ', response.status, response.statusText);
                        return;
                    }
                    const data = await response.json();
                    console.log(data);
                } catch (error) {
                    console.error('Error fetching profile:', error.message);
                }
            },

            addFavorite: async (exercise) => {
                const store = getStore();
                const userId = store.user.id;

                const favorites = [...store.favorites, exercise];
                setStore({ favorites });

                try {
                    const token = localStorage.getItem('token');

                    const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            exercise_id: exercise.id
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('Favorite added:', data);
                } catch (error) {
                    console.error('Error adding favorite:', error.message);
                }
            },

            removeFavorite: async (favoriteId) => {
                const store = getStore();
                console.log('ID to be removed (favorite):', favoriteId);

                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error('Token not found in localStorage.');
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${favoriteId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const updatedFavorites = store.favorites.filter(fav => fav.id !== favoriteId);
                        setStore({ favorites: updatedFavorites });
                        console.log('Favorito eliminado:', favoriteId);
                    } else {
                        const errorResponse = await response.json();
                        console.error('Error removing favorite:', errorResponse.message);
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                } catch (error) {
                    console.error('Error removing favorite:', error.message);
                }
            },

            setUser: (userData) => {
                setStore({ user: userData });
                setStore({ isLogin: true }); // Opcional: Marcar como logueado cuando se establece el usuario
            },
        }
    };
};

export default getState;
