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
import LoaderSpinners from './components/LoaderSpinners';

const devURL = window.location.origin === 'http://localhost:3000';
const dataFromWp = new FormData();

const App = () => {
  const [dataSector, setDataSector] = useState('')
  const [dataTipoSocio, setTipoSocio] = useState('')
  const [showFlagNodata, setShowFlagNodata] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [loaderData, setLoaderData] = useState(false)
  const [detail, setDetail] = useState<any>({})
  const [store, setStore] = useState<any>({})
  const [storeToPagination, setStoreToPagination] = useState<any>({})
  const [filterItemTipo, setFilterItemTipo] = useState([{value: 'todos', label: 'Todos los socios'}])
  const [filterItemSector, setFilterItemSector] = useState([{value: 'todos', label: 'Todos los Sectores'}])
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    dataFromWp.append('action', 'getPostContent')
    dataFromWp.append('nonce', window.wp_pageviews_ajax?.nonce)
    dataFromWp.append('sector', dataSector)
    dataFromWp.append('tipo_socio', dataTipoSocio)
    dataFromWp.append('current_page', currentPage.toString())

    const getDataFromApi = async() => {
      setShowFlagNodata(false)
      setLoaderData(true)
      setCurrentPage(0)
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


      const tempChunk = chunk(data.data, 6);
      setStoreToPagination({info: tempChunk})

      
    }
    getDataFromApi();
  }, [dataSector, dataTipoSocio])

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
  const cutString = (text:string, length: number) => {
    if(text === '') return ''
    if(text.length < 120) return text
    const substring = text.substring(0, length);
    const lastSpaceIndex = substring.lastIndexOf(" ");
    return `${text.substring(0, lastSpaceIndex)  }[...]`;
  }
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
            setTipoSocio(e.value)
        }}/>
        <Select 
          isSearchable={false} 
          className="lc-select-container"
          classNamePrefix="lc-select-sector"
          placeholder="Todos los sectores" 
          options={devURL ? mockTermTipo : filterItemSector} 
          onChange={(e:any) => {
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
              // (store.info !== undefined) && store.info.data.map((post: any) => {
                (storeToPagination.info !== undefined && storeToPagination.info.length > 0) && storeToPagination.info[(currentPage === -1) ? 1 : currentPage].map((post: any) => {
                return (
                  <div className='lc-items' key={post.id}>
                    <div className="lc-flex-content">
                      <div className='lc-tag-detail tipo'>
                          <Terms data={post.terminoTipo}/>
                      </div>
                      <div className='lc-tag-detail sector'>
                        <Terms data={post.terminoSector}/>
                      </div>
                    </div>
                    <h2 className='title-post'>{post.post_title}</h2>
                    <p className='content_post' dangerouslySetInnerHTML={{__html: cutString(post.post_excerpt, 120)}} />
                    <button onClick={() => {
                      handleFindData(post.id)
                    }}>M??s informaci??n</button>
                  </div>
                )
              })
            }
          </div>
          ) : (
            <LoaderSpinners>Buscando socios</LoaderSpinners>
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
                  <div style={{display: (detail.logo === '') ? 'flex' : ''}}>
                    <div className='lc-tag-detail tipo'>
                      <Terms data={detail.terminoTipo}/>
                    </div>
                    <div className='lc-tag-detail sector'>
                      <Terms data={detail.terminoSector}/>
                    </div>
                  </div>
                </div>
                <div className="content-block info-content">
                  <h2 className='title-post'>{detail.post_title}</h2>
                  <h3 className='title-fields'>Contacto</h3>
                  {(detail.address !== '') && (<p>{detail.address}</p>)}
                  {(detail.phone !== '') && (<p>{detail.phone}</p>)}
                  {(detail.email !== '') && (<p>{detail.email}</p>)}
                  {(detail.web !== '') && (<a href={`${detail.web}`} target="_blank" rel="noreferrer">{detail.web.split('//')[1]}</a>)}
                  {
                    (detail.maps) && (
                      <p><a href={detail.maps} rel="noreferrer" target="_blank">Ver en Google Maps</a></p>
                    )
                  }
                </div>
                <div className="content-block main-content">
                  {
                    (detail.post_content !== '') && (
                      <>
                      <h3 className='title-fields'>Descripci??n</h3>
                        <div className='contenido'>
                          <p className='content_post' dangerouslySetInnerHTML={{__html: detail.post_content}} />
                      </div>
                      </>
                    )
                  }
                  
                </div>
              </div>
          </Modal>
        )
      }
    </div>
    <div className="lc-pagination">
    {
      (storeToPagination.info !== undefined && storeToPagination.info.length > 0) && (
        storeToPagination.info.map((data:any, inx: number) => {
          return (
              // eslint-disable-next-line react/no-array-index-key
              <button key={inx} className="lc-button-page" style={{background: (inx === currentPage) ? '#f8f1e7': ''}} onClick={() => {
                setCurrentPage(inx)
              }}>{inx + 1}</button>
          )
        })
      )
    }
    </div>
    </>
  );
};

export default App;
