import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Vote, VoteModelWrappedInPagination, VotingResult } from '@/models/VoteModels';
import { plainToClass } from 'class-transformer';
import ModelWrappedInPagination from '@/models/ModelWrappedInPagination';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  }
});

async function listVote(size: number=20): Promise<VoteModelWrappedInPagination> {
  const response: AxiosResponse = await axiosInstance.get(`/votes/?size=${size}`);
  const votes: VoteModelWrappedInPagination = plainToClass(VoteModelWrappedInPagination, response.data);
  return votes;
}

async function createVote(vote: Vote): Promise<Vote> {
  const data: object = vote;
  const response: AxiosResponse = await axiosInstance.post('/votes/', data);
  const createdVote: Vote = plainToClass(Vote, response.data);
  return createdVote;
}

async function retrieveVote(id: number): Promise<Vote> {
  const response: AxiosResponse = await axiosInstance.get(`/votes/${id}/`);
  const vote: Vote = plainToClass(Vote, response.data);
  return vote;
}

async function retrieveVotingResults(id: number): Promise<VotingResult[]> {
  const response: AxiosResponse = await axiosInstance.get(`/votes/${id}/voting_results/`);
  const votingResults: VotingResult[] = response.data.map((obj: any) => plainToClass(VotingResult, obj));
  return votingResults;
}

export const api = {
  votes: {
    list: listVote,
    create: createVote,
    retrieve: retrieveVote,
    votingResults: {
      retrieve: retrieveVotingResults
    }
  },
}