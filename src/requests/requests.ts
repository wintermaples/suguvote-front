import axios from 'axios';
import { Vote } from '@/models/vote/Vote';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.3:8000/',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  }
});

async function createVote(vote: Vote) {
  const data: object = vote;
  const response = await axiosInstance.post('/votes/', data);
  console.log(response);
}

export const api = {
  votes: {
    create: createVote,
  },
}