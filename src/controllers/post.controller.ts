import {Request, Response} from 'express';

import {connect} from '../database';

import {Post} from '../interfaces/Post';

export async function getPosts(req: Request, res: Response): Promise<Response> {

    const conn = await connect();
    const posts = await conn.query('SELECT * FROM post');

    return res.json(posts[0]);

}

export async function createPost(req: Request, res: Response) {

    const newPost: Post = req.body;
    
    const conn = await connect();

    // await conn.query('INSERT INTO post SET ?', [newPost]);
    await conn.query(`INSERT INTO post (title, description, image_url) VALUES ("${newPost.title}", "${newPost.description}", "${newPost.image_url}")`)

    return res.json({
        ok: true,
        message: 'Post Created!'
    });

}

export async function getPostById(req: Request, res: Response): Promise<Response> {

    const id = req.params.postId;

    const conn = await connect();

    const post = await conn.query(`SELECT * FROM post WHERE id = ${id}`);

    return res.json({
        ok: true,
        data: post[0],
    });
    
}

export async function deletePost(req: Request, res: Response) {

    const id = req.params.postId;

    const conn = await connect();

    await conn.query(`DELETE FROM post WHERE id = ${id}`);

    return res.json({
        ok: true,
        message: `Post with id: ${id} was removed`,
    });

}

export async function updatePost(req: Request, res: Response) {
    
    const id = req.params.postId;

    const updatePost: Post = req.body;

    const conn = await connect();

    await conn.query(`UPDATE post set title="${updatePost.title}", description="${updatePost.description}", image_url="${updatePost.image_url}" WHERE id = ${id}`);

    return res.json({
        ok: true,
        message: `Post with id: ${id} was updated!`,
    });

}