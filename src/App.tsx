// <reference path="path/types.d.ts" />

import {useEffect, useState} from 'react';
import Select from 'react-select'
import "./App.scss";
import getServicesTerms from './services/getServicesTerms';

const dataFromWp = new FormData();

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [dataSector, setDataSector] = useState('')
  const [store, setStore] = useState({data:[]})

  useEffect(() => {
    dataFromWp.append('action', 'getPostContent')
    dataFromWp.append('nonce', window.wp_pageviews_ajax.nonce)
    dataFromWp.append('sector', dataSector)

  console.log(window.wp_pageviews_ajax)
  
  
  // eslint-disable-next-line no-unused-vars
  const getDataFromApi = async() => {
    const data = await getServicesTerms(dataFromWp)
    setStore(data)
    console.log(store.data)
    // eslint-disable-next-line no-debugger
    // debugger
    
  }
  getDataFromApi();
    
  }, [dataSector])
  return (
    <div className='lc-container-filter'>
      <div className="lc-control-filters">
        <Select 
          isSearchable={false} 
          classNamePrefix="trs-select-container"
          placeholder="Select " 
          options={window.wp_pageviews_ajax.terminosSector} 
          // eslint-disable-next-line arrow-body-style
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: '#000000',
              primary: 'black',
            },
          })}
          onChange={(e:any) => {
            setDataSector(e.value)
          }}/>
      </div>
      <div className="lc-container-list-items">
        <div className="lc-list-items">
          {
            store.data.map((post: any) => {
              return (
                <div className='lc-items'>
                  <img src={`${post.image}`} alt="" />
                  <h3>{post.post_title}</h3>
                  <p>dwq</p>
                  <a href="/#">Ver Más</a>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default App;
