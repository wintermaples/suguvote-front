import { VoteWrappedInPagination } from '@/entities/EntityWrappedInPagination';
import { Vote, VotingResult } from '@/entities/VoteEntities';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { plainToClass } from 'class-transformer';
import { VoteAnswer } from '@/entities/VoteAnswerEntities';
import { BASE_URL } from '@/const/CommonConst';
import { ValidatePasswordResult } from '@/entities/OtherEntities';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  withCredentials: true
});

async function logIn(username: string, password: string): Promise<boolean> {
  const data: string = JSON.stringify({
    username: username,
    password: password
  });
  try {
    const respose: AxiosResponse = await axiosInstance.post(`/auth/login/`, data);
    return true;
  } catch {
    return false;
  }
}

async function logOut(): Promise<void> {
  await axiosInstance.post(`/auth/logout/`);
}

async function isLoggedIn(): Promise<boolean> {
  const response: AxiosResponse = await axiosInstance.get(`/auth/is_logged_in/`);
  return response.data.is_logged_in;
}

async function listVote(query: any = {}): Promise<VoteWrappedInPagination> {
  const queryString: string = Object.keys(query).filter(key => query[key]).map(key => key + '=' + query[key]).join('&');
  const response: AxiosResponse = await axiosInstance.get(`/votes/?${queryString}`);
  const votes: VoteWrappedInPagination = plainToClass(VoteWrappedInPagination, response.data);
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
  const response: AxiosResponse = await axiosInstance.post(`/votes/${id}/voting_results/`, data);
  const votingResults: VotingResult[] = response.data.map((obj: any) => plainToClass(VotingResult, obj));
  return votingResults;
}

async function validatePassword(password: string): Promise<ValidatePasswordResult> {
  const data: string = JSON.stringify({
    password: password
  });
  const response: AxiosResponse = await axiosInstance.post(`/general/validate_password`, data);
  const validatePasswordResult: ValidatePasswordResult = plainToClass(ValidatePasswordResult, response.data);
  return validatePasswordResult;
}

export const api = {
  auth: {
    logIn: logIn,
    logOut: logOut,
    isLoggedIn: isLoggedIn
  },
  general: {
    validatePassword: validatePassword
  },
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