import { VoteModelWrappedInPagination } from '@/models/ModelWrappedInPagination';
import { Vote, VotingResult } from '@/models/VoteModels';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { plainToClass } from 'class-transformer';
import { VoteAnswer } from '@/models/VoteAnswerModel';

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

async function postVotingResults(id: number, voteAnswers: VoteAnswer[], recaptcha_token: string): Promise<VotingResult[]> {
  const data: string = JSON.stringify({
    answers: voteAnswers,
    recaptcha_token: recaptcha_token
  });
  const response: AxiosResponse =  await axiosInstance.post(`/votes/${id}/voting_results/`, data);
  const votingResults: VotingResult[] = response.data.map((obj: any) => plainToClass(VotingResult, obj));
  return votingResults;
}

export const api = {
  votes: {
    list: listVote,
    create: createVote,
    retrieve: retrieveVote,
    votingResults: {
      retrieve: retrieveVotingResults,
      post: postVotingResults,
    }
  },
}