import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Layout from './Components/Layout';
import MainPage from './Pages/MainPage';
import Companies from './Pages/Companies';
import Transactions from './Pages/Transactions';
import Inventory from './Pages/Inventory';
import CreateOrder from './Pages/CreateOrder';

import { BrowserRouter as Router, Route } from 'react-router-dom';

setInterval(function () { alert("Hello"); }, 3000);
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Layout >
        <>
          <Route path="/" exact component={MainPage} />
          <Route path="/companies" exact component={Companies} />
          <Route path="/transactions" exact component={Transactions} />
          <Route path="/inventory" exact component={Inventory} />
          <Route path="/createorder" exact component={CreateOrder} />
        </>
      </Layout>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
