import { useState } from "react"
import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
      const { dispatch } = useWorkoutContext();
      const { user } = useAuthContext()

      const[title, setTitle] = useState('')
      const[load, setLoad] = useState('')
      const[reps, setReps] = useState('')
      const[error, setError] = useState(null)
      const[emptyFields, setEmptyFiels] = useState([])
      

      const handleSubmit = async (e) => {
            e.preventDefault()

            if(!user){
                  setError('You must be logged in')
                  return
            }

            const workout = {title, load, reps}

            const response =  await fetch('/api/workout',{
                  method: 'POST',
                  body: JSON.stringify(workout),
                  headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                  }
            })
            const json = await response.json()

            if(!response.ok){
                  setError(json.error)
                  setEmptyFiels(json.emptyFields)
            }
            if(response.ok){
                  setTitle('')
                  setLoad('')
                  setReps('')
                  setError(null)
                  setEmptyFiels([])
                  console.log('new workout added', json)
                  dispatch({type: 'CREATE_WORKOUTS', payload: json})
            }
      }

      return (
        <form className="create" onSubmit={handleSubmit}>
          <h3>Add a new Workout</h3>

          <label>Exercise Title:</label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes("title") ? "error" : ""}
          />

          <label>Load (in kg):</label>
          <input
            type="number"
            onChange={(e) => setLoad(e.target.value)}
            value={load}
            className={emptyFields.includes("load") ? "error" : ""}
          />

          <label>Reps:</label>
          <input
            type="number"
            onChange={(e) => setReps(e.target.value)}
            value={reps}
            className={emptyFields.includes("reps") ? "error" : ""}
          />
          <button>Add Workout </button>
          {error && <div className="error">{error}</div>}
        </form>
      );
}

export default WorkoutForm