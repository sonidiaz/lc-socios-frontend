/* eslint-disable react/button-has-type */
// <reference path="path/types.d.ts" />

import {useEffect, useState} from 'react';
import Select from 'react-select'
import getServicesTerms from './services/getServicesTerms';
import Modal from './components/Modal'
import "./App.scss";
import mock from './services/mock.json'
import mockTermSector from './services/terminosSector.json'
import mockTermTipo from './services/terminosTipo.json'
import Terms from './components/Terms';

const devURL = window.location.origin === 'http://localhost:3000';
const dataFromWp = new FormData();

const App = () => {
  const [dataSector, setDataSector] = useState('')
  const [dataTipoSocio, setTipoSocio] = useState('')
  const [showFlagNodata, setShowFlagNodata] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loaderData, setLoaderData] = useState(false)
  const [detail, setDetail] = useState<any>({})
  const [store, setStore] = useState<any>({})
  // const [totalData, setTotalData] = useState<any>(0)
  const [storeToPagination, setStoreToPagination] = useState<any>({})
  const [filterItemTipo, setFilterItemTipo] = useState([{value: 'todos', label: 'Todos los socios'}])
  const [filterItemSector, setFilterItemSector] = useState([{value: 'todos', label: 'Todos los Sectores'}])
  const [showModal, setShowModal] = useState(false);
  // const selectTheme = (theme: any) => {
  //   return {
  //     ...theme,
  //     borderRadius: 5,
  //     colors: {
  //       ...theme.colors,
  //       primary25: 'white',
  //       primary: '#1AA19A',
  //     }
  //   }
  // }
  useEffect(() => {

    dataFromWp.append('action', 'getPostContent')
    dataFromWp.append('nonce', window.wp_pageviews_ajax?.nonce)
    dataFromWp.append('sector', dataSector)
    dataFromWp.append('tipo_socio', dataTipoSocio)
    dataFromWp.append('current_page', currentPage.toString())

    const getDataFromApi = async() => {
      setShowFlagNodata(false)
      setLoaderData(true)
      const data = await getServicesTerms(dataFromWp)
      if(devURL) {
        setStore({info:{data: mock}})
        return
      }
      if(data.data !== undefined && data.data.length < 1) {
        setShowFlagNodata(true)
      }
      setStore({info: data})
      
      setLoaderData(false)


      // eslint-disable-next-line arrow-body-style
      const chunk = (arr:[], size:number) => arr.reduce((acc:any, e, i) => {return (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc)}, []);
      const tempChunk = chunk(data.data, 2);
      console.log(tempChunk);
      setStoreToPagination({info: tempChunk})
    }
    getDataFromApi();
  }, [dataSector, dataTipoSocio])

  useEffect(() => {
    console.log(storeToPagination)
  }, [storeToPagination])

  // eslint-disable-next-line no-unused-vars
  const handleFindData = (e: any) => {
    // eslint-disable-next-line arrow-body-style
    const getDetail = store.info.data.find((elemento:any) => elemento.id === e)
    setDetail(getDetail)
    setShowModal(true)
  }
  useEffect(() => {
    if(devURL){
      setFilterItemTipo([
        ...filterItemTipo,
        ...mockTermSector
      ])
    }else{
      setFilterItemTipo([
        ...filterItemTipo,
        ...window.wp_pageviews_ajax.terminosTipoSocios
      ])
      setFilterItemSector([
        ...filterItemSector,
        ...window.wp_pageviews_ajax.terminosSector
      ])
    }
  }, [])

  return (
    <>
    <div className='lc-container-filter'>
      <div className="lc-control-filters">
        <Select 
          isSearchable={false} 
          className="lc-select-container"
          classNamePrefix="lc-select"
          placeholder="Todos los socios " 
          options={filterItemTipo} 
          onChange={(e:any) => {
            setCurrentPage(-1)
            setTipoSocio(e.value)
        }}/>
        <Select 
          isSearchable={false} 
          className="lc-select-container"
          classNamePrefix="lc-select-sector"
          placeholder="Todos los sectores" 
          options={devURL ? mockTermTipo : filterItemSector} 
          onChange={(e:any) => {
            setCurrentPage(-1)
            setDataSector(e.value)
          }}/>
      </div>
      <div className="lc-container-list-items">
        {
          (showFlagNodata) && 
            (
              <span>No hay resultados para <b>{dataSector}</b> y <b>{dataTipoSocio}</b>. </span>
            )
        }
        {
          !loaderData ? (
            <div className="lc-list-items">
            {
              (store.info !== undefined) && store.info.data.map((post: any) => {
                return (
                  <div className='lc-items' key={post.id}>
                    <div className='lc-tag-detail tipo'>
                        <Terms data={post.terminoTipo}/>
                    </div>
                    <div className='lc-tag-detail sector'>
                      <Terms data={post.terminoSector}/>
                    </div>
                    <h2 className='title-post'>{post.post_title}</h2>
                    <p className='content_post' dangerouslySetInnerHTML={{__html: post.post_excerpt.substring(0,120)}} />
                    <button onClick={() => {
                      handleFindData(post.id)
                    }}>Más información</button>
                  </div>
                )
              })
            }
          </div>
          ) : (
            <span>Buscando datos...</span>
          )
        }
      </div>
      {
        showModal && (
          <Modal>
              <button className='lc-close-modal icon-close'
                onClick={() => {return setShowModal(false)}}>
                +
              </button>
              <div className="lc-content-main">
                {
                  detail.logo !== '' && (
                    <div className="content-block logo-wrapper">
                      <img className="logo" src={detail.logo} alt="" />
                    </div>
                  )
                }
                <div className='content-block terminos' style={{width: (detail.logo === '') ? '100%' : ''}}>
                  <div className='lc-tag-detail tipo'>
                    <Terms data={detail.terminoTipo}/>
                  </div>
                  <div className='lc-tag-detail sector'>
                    <Terms data={detail.terminoSector}/>
                  </div>
                </div>
                <div className="content-block info-content">
                  <h2 className='title-post'>{detail.post_title}</h2>
                  <h3 className='title-fields'>Contacto</h3>
                  <p>{detail.address}</p>
                  <p>{detail.phone}</p>
                  <p>{detail.email}</p>
                </div>
                <div className="content-block main-content">
                  <h3 className='title-fields'>Descripción</h3>
                  <div className='contenido'>
                    <p className='content_post' dangerouslySetInnerHTML={{__html: detail.post_content}} />
                  </div>
                </div>
              </div>
          </Modal>
        )
      }
    </div>
    <div className="lc-pagination">
      {
        console.log(storeToPagination)
      }
        <button className="lc-button-page" onClick={() => {
          setCurrentPage(1)
        }}>1</button>
        <button className="lc-button-page" onClick={() => {
          setCurrentPage(2)
        }}>2</button>
        <button className="lc-button-page" onClick={() => {
          setCurrentPage(3)
        }}>3</button>
    </div>
    </>
  );
};

export default App;
