import { authService } from '../services';

const fetchData = async (param) => {
  if(param.examId) {
    const res = await authService().getExam(param.examId);
    return {data: res.data, topic: 'exam'};
  }
  else {
    const res = await authService().getList();
    return {data: res.data, topic: 'list'};
  }
};

export default fetchData;

