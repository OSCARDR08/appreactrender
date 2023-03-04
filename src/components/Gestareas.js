import axios from 'axios';
import React, { Component, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { variables } from '../variables';
import AsyncSelect from 'react-select/async';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import { Input } from 'semantic-ui-react';






const Gestareas = () => {

 

    const[id, idchange]=useState(" ");
    const[cliente, setCliente]=useState(" ");
    const[tTarea, settTarea]=useState(" ");
    const[inicia, setInicia]=useState(" ");
    const[fin, setFin]=useState(" ");
    const[precio, setPrecio]=useState(" ");
    const[comentario, setComentario]=useState(" ");
    const [validation, setValidation]=useState();
    const[cliendataG, setCliendataG]=useState();


  



    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post(variables.API_URL+"api/tareas",{
            idcliente: cliente,
            idtipotarea: tTarea,
            fechainicio: inicia,
            fechafin: fin,
            precio: precio,
           comentario: comentario
        }).then((res)=>{
            toast.success('Success');
        }).catch((err)=>{
            toast.error(err.message);
        })
    }

    const [inputValue, setValue] = useState(cliente);
    const [inputValuet, setValuet] = useState(' ');
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedValuet, setSelectedValuet] = useState(null);
    const [query, setQuery] = useState("");
    const [post, setPost]=useState();
    const [showEdit, setShowEdit]=useState(false);
    const [showDetail, setShowDetail]=useState(false);
    const[tareaId, setTareaId]=useState();
    

    const handleInputChange = value => {
      setValue(value);
    };

    const handleInputChanget = valuet => {
      setValuet(valuet);
    };

    

    const handleChange = value => {
      setSelectedValue(value);
      setCliente(value.nombrecliente)
    }

    const handleChanget = valuet => {
      setSelectedValuet(valuet);
      settTarea(valuet.tipotarea)
    }

  

   

    const loadOptions = async () => {
      const res = await fetch(variables.API_URL + `api/clientes/cmblst?q=${query}`);
      return await res.json();
    };

    const loadOptionsT = async () => {
      const res = await fetch(variables.API_URL + `api/tipotareas/cmblst?q=${query}`);
      return await res.json();
    };

    
    
   
    useEffect(()=>{
      axios.get(variables.API_URL+"api/tareas/grdlst").then((res)=>{
        setPost(res.data);
        setFilterResults(res.data)
      }).catch((err)=>{
        toast.error(err.message);
      })
    },[])
    
    const[searchInput, setSearchInput] = useState('');
    const[filterResults, setFilterResults]=useState(post);
    
    
    
  

    const searItems=(searchValue)=>{
      setSearchInput(searchValue);
      if(searchInput !== " "){
      const filterData =  post.filter((item) => {
        return Object.values(item).join(' ').toLowerCase().includes(searchInput.toLowerCase())
      })
      setFilterResults(filterData);
    }else{
      
    } 
    }

   
    
    const handleShowAdd =() =>{
      setShowEdit(true);
    }
    
    const handleCloseEdit =() =>{
      setShowEdit(false)
    }

    const handleCloseDetail =() =>{
      setShowDetail(false)
    }

    const handleShowDetail =(id)=>{
      axios.get(variables.API_URL+"api/tareas/grdlst"+id).then((res)=>{
        setPost(res.data)
        
    }).catch((err)=>{
      toast.error(err.message);
    })
      setShowDetail(true);
    }


    const handleShowEdit =(id) =>{
      setTareaId(id);
      axios.get(variables.API_URL+"api/tareas/grdlst"+id).then((res)=>{
           
        setCliente(res.data.cliente);
        settTarea(res.data.tipotarea);
        setInicia(res.data.fechainicio);
        setFin(res.data.fechafin);
        setPrecio(res.data.precio);
        setComentario(res.data.comentario);
        
        
    }).catch((err)=>{
      toast.error(err.message);
    })
      setShowEdit(true);
    }
    

    

    const handlePut=()=>{
      //e.preventDefault();
      //let jwttoken = sessionStorage.getItem("jwttoken");
      axios.put(variables.API_URL+"api/tareas/"+tareaId,{
            idtarea: id,
            idcliente : cliente,
            idtipotarea: tTarea,
            fechainicio: inicia,
            fechafin: fin,
            precio: precio,
            comentario: comentario
      }).then((res)=>{
        toast.success('Success');

      }).catch((err)=>{
        toast.error(err.message);
      })
    }

  return (
    <div className='bg-dark bg-gradient text-white'>
        <div className="container " >
        <div className="offset-lg-3 col-lg-6 " >
          <h1 className=''>Task Manager</h1>
            <form className="container" onSubmit={handleSubmit}>
              <label>Select Client</label>
            <AsyncSelect
        cacheOptions
        defaultOptions
        value={selectedValue}
        getOptionLabel={e => e.nombrecliente}
        getOptionValue={e => e.idcliente}
        loadOptions={loadOptions}
        onInputChange={(handleInputChange) => setQuery(handleInputChange)}
        onChange={handleChange}
        />

          <label>Select Task</label>
            <AsyncSelect
        cacheOptions
        defaultOptions
        value={selectedValuet}
        getOptionLabel={e => e.tipotarea}
        getOptionValue={e => e.idtipotarea}
        loadOptions={loadOptionsT}
        onInputChange={(handleInputChanget) => setQuery(handleInputChanget)}
        onChange={handleChanget}
        />
        <div className='col-lg-12'>
          <label className='m-2'>Start Date</label>
          <input type="date" onChange={e=>setInicia(e.target.value)}/>
        </div>
        <div className='col-lg-12'>
          <label className='m-2'>End Date</label>
          <input type="date" onChange={e=> setFin(e.target.value)}/>
        </div>
        <div className='col-lg-12'>
          <label className='m-2' >Price</label>
          <input type="number" onChange={e=>setPrecio(e.target.value)}/>
        </div>
        <div className='col-lg-12'>
          <label className='m-2' >Coment</label>
          <textarea onChange={e=>setComentario(e.target.value)}/>
        </div>
             <button className='btn btn-success' type='submit'>guardar</button>
            </form>
        </div>
        <div>  
          <div>
            <Input icon='search' placeholder='Search' onChange={(e) => searItems(e.target.value)} />
          </div>
        <table className="table table-bordered text-white">
              <thead className="bg-secondary bg-gradient text-white">
                <tr className=''>
                  <td>Client</td>
                  <td>Task</td>
                  <td>Start Date</td>
                  <td>Price</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
               
                  {filterResults &&
                    filterResults.map((item) => (
                      <tr key={item.iditarea}>
                        <td>{item.cliente}</td>
                        <td>{item.tipotarea}</td>
                        <td>{item.fechainicio}</td>
                        <td>{item.fechafin}</td>
                        <td>
                        <a
                            onClick={() => {
                              handleShowAdd(item.idtarea);
                            }}
                            className="btn btn-primary"
                          >
                            employee
                          </a>
                          <a
                            onClick={() => {
                              handleShowEdit(item.idtarea);
                            }}
                            className="btn btn-warning m-2"
                          >
                            Edit
                          </a>
                          <a
                            onClick={() => {
                              handleShowDetail(item.idtarea);
                            }}
                            className="btn btn-dark m-2"
                          >
                            Details
                          </a>
                        </td>
                      </tr>
                    
                    ))}
              </tbody>
             </table>
        </div>

        <div>
        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Task Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form className="container" >
              <label>Select Client</label>
            <AsyncSelect
             cacheOptions
             defaultOptions
             defaultValue={cliente}
             value={selectedValue }
             getOptionLabel={e => e.nombrecliente}
             getOptionValue={e => e.idcliente}
             loadOptions={loadOptions}
             onInputChange={(handleInputChange) => setQuery(handleInputChange)}
             onChange={handleChange}
               />

          <label>Select Task</label>
            <AsyncSelect
             cacheOptions
             defaultOptions
             value={selectedValuet}
              getOptionLabel={e => e.idtipotarea}
              getOptionValue={e => e.tipotarea}
             loadOptions={loadOptionsT}
              onInputChange={(handleInputChanget) => setQuery(handleInputChanget)}
             onChange={handleChanget}
              />
        <div className='col-lg-12'>
          <label className='m-2'>Start Date</label>
          <input type="date" value={inicia} onChange={e=>setInicia(e.target.value)}/>
        </div>
        <div className='col-lg-12'>
          <label className='m-2'>End Date</label>
          <input type="date"value={fin} onChange={e=> setFin(e.target.value)}/>
        </div>
        <div className='col-lg-12'>
          <label className='m-2' >Price</label>
          <input type="number" value={precio} onChange={e=>setPrecio(e.target.value)}/>
        </div>
        <div className='col-lg-12'>
          <label className='m-2' >Coment</label>
          <textarea value={comentario} onChange={e=>setComentario(e.target.value)}/>
        </div>
             <button className='btn btn-success' onClick={e=>handlePut(id)}>Save</button>
             <button className='btn btn-success m-2' onClick={handleCloseEdit}>Cancel</button>
            </form>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
        </div>

        <div>                     
        <Modal show={showDetail} onHide={handleCloseDetail}>
          <Modal.Header closeButton>
            <Modal.Title>Task Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className='container'>
            <div className='card row'>
              <div className='card-title' >           
              </div>
              <div className='card-body'></div> 
                {post && (
                  <div>
                    <h2>Client: {post.idcliente}</h2>
                    <h2>Task: {post.tipotarea}</h2>
                    <h2>Start Date: {post.fechainicio}</h2>
                    <h2>End Date: {post.fechafin}</h2>
                    <h2>Price: {post.precio}</h2>
                    <h2>Coment: {post.comentario}</h2>
                  </div>
                )}             
            </div>

          </div>

          
          </Modal.Body>
          <Modal.Footer>
          <button className='btn btn-danger' onClick={handleCloseDetail}>Back</button>
          </Modal.Footer>
        </Modal>
        </div>
    </div>
    </div>
  )
}

export default Gestareas