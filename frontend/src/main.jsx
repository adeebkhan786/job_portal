import { createRoot } from 'react-dom/client'
import  {Provider} from 'react-redux';


//Importing files
import App from './App.jsx';
import store from './store/store.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
