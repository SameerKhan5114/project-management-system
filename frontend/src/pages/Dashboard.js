
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../api/client';
import { setTasks } from '../store/taskSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const tasks = useSelector(s => s.tasks.list);

  useEffect(() => {
    axios.get('/tasks').then(res => dispatch(setTasks(res.data)));
  }, [dispatch]);

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.map(t => <div key={t._id}>{t.title} - {t.status}</div>)}
    </div>
  );
}
