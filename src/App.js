import { useState } from 'react';
import './index.css';


// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "charger", quantity: 12, packed: true },
//   { id: 4, description: "bags", quantity: 12, packed: true },

// ];

export default function App(){
  const [items,setItem]=useState([]);
  function handelAddItem(item){
    setItem((items)=>[...items,item]);
  }
  function handelDeleteItem(id){
    setItem((items)=>items.filter((item)=>item.id!==id));
  }
  function toggleItem(id){
    setItem((items)=>items.map((item)=>item.id===id?{...item,packed:!item.packed}:item))
  }
  function clearLits(){
    let confirmid=window.confirm("are you sure to delete all items ?");
    if(confirmid)
      setItem([]);
  }
  return(<div className='app'>
    <Logo/>
    <Form onAddItem={handelAddItem}/>
    <Packinglist items={items} onDeleteItem={handelDeleteItem} onToggleItem={toggleItem} onClearLits={clearLits}/>
    <Stats items={items}/>
  </div>);
  }

const Logo=()=>{
  return <h1>🏝️ Far Away 🧳</h1>;
}
const Form=({onAddItem})=>{
  const [description,setDescription]=useState("");
  const[quantity,setQuantity]=useState(1);
  function handelSubmit(e){
    e.preventDefault();
    const newItem={
      description,quantity,packed:false,id:Date.now()
    };
    onAddItem(newItem);
    setDescription("");
    setQuantity(1);
  }
  return(<form className='add-form' onSubmit={handelSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))}>
        {
          Array.from({length:20},(_,i)=> i+1).map((num)=>(
            <option value={num} key={num}>{num}</option>
          ))
        }
        </select>
        <input type="text" placeholder='...item' value={description} onChange={(e)=>(setDescription(e.target.value))}/>
        <button>ADD</button>
      </form>)
}

const Packinglist=({items,onDeleteItem,onToggleItem,onClearLits})=>{
  const [sortBy,setSortBy]=useState("input");
  let sortItem;
  if(sortBy==="input") sortItem=items;
  if(sortBy==="description") sortItem=items.slice().sort((a,b)=>a.description.localeCompare(b.description));
  if(sortBy==="packed") sortItem=items.slice().sort((a,b)=>Number(a.packed)-Number(b.packed));
  return(
    <div className='list' >
       <ul>
    {
      sortItem.map((item)=>(
        <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem}/>
      ))
    }
  </ul>
  <div className='actions'>
    <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
      <option value="input">Sort by input order</option>
      <option value="description">Sort by input description</option>
      <option value="packed">Sort by input packed</option>
    </select>
    <button onClick={onClearLits}>clear list</button>
  </div>
    </div>
 )
}

const Item=({item,onDeleteItem,onToggleItem})=>{
  return(<li>
    <input type="checkbox" value={item.id} onChange={()=>onToggleItem(item.id)}/>
    <span style={item.packed ? {textDecoration : "line-through"}:{}}>{item.quantity} {item.description} </span><button onClick={()=>onDeleteItem(item.id)}>❌</button>
   </li>
  )
}
const Stats=({items})=>{
  const numItems=items.length;
  if(!numItems)
    return(
  <p className='stats'>
    <em>start adding some items to your packing list 🚀</em>
  </p>
  )
  const numPackedItem=(items.filter((item)=>item.packed)).length;
  const percentage= (numItems !==0 ? (Math.round((numPackedItem/numItems)*100)):0);
  
  return(<div className='stats '>
    <em>{
      percentage!==100 ?( ` 💼 You have ${numItems} items on your list, and you already packed ${numPackedItem} (${percentage}%)
        `):"you got everything! Ready to go ✈"
     
    }</em>
    
  </div>)
}