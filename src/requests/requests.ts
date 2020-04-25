import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Vote } from '@/models/VoteModels';
import { plainToClass } from 'class-transformer';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://192.168.0.3:8000/',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  }
});

async function createVote(vote: Vote): Promise<Vote> {
  const data: object = vote;
  const response: AxiosResponse = await axiosInstance.post('/votes/', data);
  const createdVote: Vote = plainToClass(Vote, response.data);
  return createdVote;
}

async function detailVote(id: number): Promise<Vote> {
  const response: AxiosResponse = await axiosInstance.get(`/votes/${id}/`);
  const vote: Vote = plainToClass(Vote, response.data);
  return vote;
}

async function votingResults(id: number): Promise<any> {
  const response: AxiosResponse = await axiosInstance.get(`/votes/${id}/voting_results/`);
  return response.data;
}

export const api = {
  votes: {
    create: createVote,
    detail: detailVote,
    votingResults: {
      get: votingResults
    }
  },
}