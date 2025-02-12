/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Notebook } from '../models/Notebook';
import type { NotebookSettings } from '../models/NotebookSettings';
import type { NotebooksViewedByUser } from '../models/NotebooksViewedByUser';
import type { NoteBrief } from '../models/NoteBrief';
import type { NoteCreationDTO } from '../models/NoteCreationDTO';
import type { RedirectToNoteResponse } from '../models/RedirectToNoteResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RestNotebookControllerService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param notebook
     * @param requestBody
     * @returns Notebook OK
     * @throws ApiError
     */
    public update1(
        notebook: number,
        requestBody: NotebookSettings,
    ): CancelablePromise<Notebook> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notebooks/{notebook}',
            path: {
                'notebook': notebook,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param notebook
     * @returns Notebook OK
     * @throws ApiError
     */
    public shareNotebook(
        notebook: number,
    ): CancelablePromise<Notebook> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notebooks/{notebook}/share',
            path: {
                'notebook': notebook,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns RedirectToNoteResponse OK
     * @throws ApiError
     */
    public createNotebook(
        requestBody: NoteCreationDTO,
    ): CancelablePromise<RedirectToNoteResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notebooks/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param notebook
     * @param circle
     * @returns Notebook OK
     * @throws ApiError
     */
    public moveToCircle(
        notebook: number,
        circle: number,
    ): CancelablePromise<Notebook> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/notebooks/{notebook}/move-to-circle/{circle}',
            path: {
                'notebook': notebook,
                'circle': circle,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @returns NotebooksViewedByUser OK
     * @throws ApiError
     */
    public myNotebooks(): CancelablePromise<NotebooksViewedByUser> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notebooks',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param notebook
     * @returns NoteBrief OK
     * @throws ApiError
     */
    public downloadNotebookDump(
        notebook: number,
    ): CancelablePromise<Array<NoteBrief>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notebooks/{notebook}/dump',
            path: {
                'notebook': notebook,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
