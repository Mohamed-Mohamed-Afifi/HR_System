import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Dashboard } from './routes/pages/Dashboard/Dashboard.jsx';
import { DashLayout } from './routes/pages/Layout/DashLayout.jsx';
import ErrorPage from './routes/pages/Errors/ErrorPage.jsx';
import { Department } from './routes/pages/Departments/Department.jsx';
import  LoginLayout  from './routes/pages/Layout/LoginLayout.jsx';
import  Login  from './routes/pages/User/Login.jsx';
import Employee from './routes/pages/Employees/Employee.jsx';
import Project from './routes/pages/Projects/Project.jsx';
import Dependent from './routes/pages/Dependents/Dependent.jsx';
import { store } from './Store.jsx';
const routes=createBrowserRouter([
    {
        path:"/",
        element:<DashLayout/>,
        errorElement:<ErrorPage/>,
        children:[
            {
                index:true,
                element:<Dashboard/>
            },
            {
                path:"departments",
                element:<Department/>
            },
            {
                path:"employees",
                element:<Employee/>
            },
            {
                path:"projects",
                element:<Project/>
            },
            {
                path:"dependents",
                element:<Dependent/>
            },
        ],
    },
    {
        path:"/user",
        element:<LoginLayout/>,
        errorElement:<ErrorPage/>,
        children:[
            {
                path:"login",
                element:<Login/>
            }
        ]
    }
])
render(<Provider store={store}>
         <RouterProvider router={routes}/>
    </Provider>, document.getElementById('app')
    )
