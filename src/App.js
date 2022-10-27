import React, { useEffect, useState } from 'react'
import Alert from './components/Alert';
import List from './components/List';

const getLocalStorage = () =>{
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }else{
    return []
  }
}
const App = () => {
  const [name, setName ] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditId] = useState(null);
  const [alert, setAlert] = useState({show:false, msg:'', type:''});
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(!name){
      //display alert
      showAlert(true,'danger', 'Please enter a value')
    }else if(name && isEditing){
      //deal with editing
      setList(list.map((item) => {
        if(item.id === editID){
            return {...item, title:name}
        }
        return item
      }))
      setName('');
      setEditId(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value Changed')
    }else{
      showAlert(true, 'success', 'Item Added to the List');
      const newItem = {id: new Date().getTime().toString(), title:name};
      setList([...list, newItem])
      setName('')
    }
  } 
  const showAlert = (show=false, type='', msg='')=>{
    setAlert({show, type, msg})
  }
  const clearList = () =>{
    showAlert(true, 'danger', 'Empty List');
    setList([])
  }
  const removeItem = (id) =>{
    showAlert(true, 'danger', 'Item Removed');
    setList(list.filter((item)=> item.id !== id))
  }
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title)
  }

  useEffect(() =>{
      localStorage.setItem('list', JSON.stringify(list))
  }, [list])
  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
          <h3>Grocery Curd App</h3>
          <div className='form-control'>
            <input type='text' className='grocery' placeholder='eg: Eggs' value={name} onChange={(e) => setName(e.target.value)} />
            <button type='submit' className='submit-btn'>{isEditing ? 'Edit' : 'Submit'}</button>
          </div>
      </form>
      {
        list.length > 0 && (
          <div className='grocery-container'>
            <List items={list} removeItem={removeItem} editItem={editItem} />
            <button className='clear-btn' onClick={clearList}>Clear items</button>
          </div>
        )
      }
    </section>
  )
}

export default App