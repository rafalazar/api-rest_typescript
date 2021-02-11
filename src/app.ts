import express, {Application} from 'express';
import morgan from 'morgan';

//Routes
import IndexRoutes from './routes/index.routes';
import PostsRoutes from './routes/post.routes';
import EmployeeRoutes from './routes/employee.routes';

export class App {

    private app: Application;
    private port?: number | string;

    constructor(port?: number | string) {
        this.app = express();
        this.port = port;

        this.settings();
        this.middlewares();
        this.routes();
    }

    settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    }

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(express.json());
    }

    routes() {
        this.app.use(IndexRoutes);
        this.app.use('/posts', PostsRoutes);
        this.app.use('/auth', EmployeeRoutes);
    }

    async listen() {
        await this.app.listen(this.app.get('port'));
        console.log('Server on PORT ', this.app.get('port'));
        
    }

}