/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiAssistantResponse } from '../models/AiAssistantResponse';
import type { AiCompletionAnswerClarifyingQuestionParams } from '../models/AiCompletionAnswerClarifyingQuestionParams';
import type { AiCompletionParams } from '../models/AiCompletionParams';
import type { AiGeneratedImage } from '../models/AiGeneratedImage';
import type { ChatRequest } from '../models/ChatRequest';
import type { SseEmitter } from '../models/SseEmitter';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RestAiControllerService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param note
     * @param requestBody
     * @returns AiAssistantResponse OK
     * @throws ApiError
     */
    public getCompletion(
        note: number,
        requestBody: AiCompletionParams,
    ): CancelablePromise<AiAssistantResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/ai/{note}/completion',
            path: {
                'note': note,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @returns string OK
     * @throws ApiError
     */
    public recreateAllAssistants(): CancelablePromise<Record<string, string>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/ai/recreate-all-assistants',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns AiGeneratedImage OK
     * @throws ApiError
     */
    public generateImage(
        requestBody: string,
    ): CancelablePromise<AiGeneratedImage> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/ai/generate-image',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param note
     * @param requestBody
     * @returns SseEmitter OK
     * @throws ApiError
     */
    public chat1(
        note: number,
        requestBody: ChatRequest,
    ): CancelablePromise<SseEmitter> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/ai/chat1/{note}',
            path: {
                'note': note,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param note
     * @param requestBody
     * @returns AiAssistantResponse OK
     * @throws ApiError
     */
    public chat(
        note: number,
        requestBody: ChatRequest,
    ): CancelablePromise<AiAssistantResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/ai/chat/{note}',
            path: {
                'note': note,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns AiAssistantResponse OK
     * @throws ApiError
     */
    public answerCompletionClarifyingQuestion(
        requestBody: AiCompletionAnswerClarifyingQuestionParams,
    ): CancelablePromise<AiAssistantResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/ai/answer-clarifying-question',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @returns string OK
     * @throws ApiError
     */
    public getAvailableGptModels(): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/ai/available-gpt-models',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
