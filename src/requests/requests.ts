import { VoteModelWrappedInPagination } from '@/models/ModelWrappedInPagination';
import { Vote, VotingResult } from '@/models/VoteModels';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { plainToClass } from 'class-transformer';
import { VoteAnswer } from '@/models/VoteAnswerModel';
import { Dictionary } from 'vue-router/types/router';
import { BASE_URL } from '@/const/CommonConst';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  withCredentials: true
});

async function listVote(query: any={}): Promise<VoteModelWrappedInPagination> {
  const queryString: string = Object.keys(query).filter(key => query[key]).map(key => key + '=' + query[key]).join('&');
  const response: AxiosResponse = await axiosInstance.get(`/votes/?${queryString}`);
  const votes: VoteModelWrappedInPagination = plainToClass(VoteModelWrappedInPagination, response.data);
  return votes;
}

async function createVote(vote: Vote, recaptcha_token: string): Promise<Vote> {
  const data: string = JSON.stringify({
    ...vote,
    recaptcha_token: recaptcha_token
  });
  const response: AxiosResponse = await axiosInstance.post('/votes/', data);
  const createdVote: Vote = plainToClass(Vote, response.data);
  return createdVote;
}

async function retrieveVote(id: number): Promise<Vote> {
  const response: AxiosResponse = await axiosInstance.get(`/votes/${id}/`);
  const vote: Vote = plainToClass(Vote, response.data);
  return vote;
}

async function updateVote(vote: Vote): Promise<Vote> {
  const data: string = JSON.stringify(vote);
  const response: AxiosResponse = await axiosInstance.put(`/votes/${vote.pk}/`, data);
  const updatedVote: Vote = plainToClass(Vote, response.data);
  return updatedVote;
}

async function deleteVote(id: number, password: string): Promise<void> {
  const config: object = {
    data: {
      password: password
    }
  };
  const response: AxiosResponse = await axiosInstance.delete(`/votes/${id}/`, config);
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
    update: updateVote,
    delete: deleteVote,
    votingResults: {
      retrieve: retrieveVotingResults,
      post: postVotingResults,
    }
  },
}