
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'tasks',
  initialState: { list: [], loading: false },
  reducers: {
    setTasks: (s, a) => { s.list = a.payload; },
    updateTaskOptimistic: (s, a) => {
      const i = s.list.findIndex(t => t._id === a.payload._id);
      if (i !== -1) s.list[i] = a.payload;
    }
  }
});

export const { setTasks, updateTaskOptimistic } = slice.actions;
export default slice.reducer;
