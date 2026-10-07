import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{BrowserRouter,useNavigate,useParams,Link,Routes,Route}from'react-router-dom';
import axios from'axios';
import logo from'./assets/classonn-logo.png';
import sampleNotebook from'./assets/classonn-sample-notebook.png';
import'./style.css';

const API='http://localhost:5000/api',money=n=>'₹'+Number(n).toLocaleString('en-IN');

function Nav({cart,user,setUser}){let nav=useNavigate();return <>
  <nav className="site-nav"><Link className="logo" to="/" aria-label="Classonn home"><img src={logo} alt="Classonn+" /></Link>
    <div className="links"><Link to="/">Home</Link><Link to="/products">Products</Link><a href="/#about">About</a><Link to="/contact">Contact</Link></div>
    <div className="navRight">{user?<button className="navPlain" onClick={()=>{localStorage.removeItem('user');localStorage.removeItem('token');setUser(null)}}>Logout</button>:<Link className="navPlain" to="/login">Login</Link>}<Link className="cart" to="/cart" aria-label={`Shopping cart, ${cart.reduce((a,x)=>a+x.quantity,0)} items`}><svg className="cartIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><span className="cart-label">Cart</span><b>{cart.reduce((a,x)=>a+x.quantity,0)}</b></Link></div>
  </nav></>}

function Home(){return <>
  <section className="hero"><div className="heroCopy"><small>THE CLASSonn+ COLLECTION</small><h1>Made to hold<br/><i>your ideas.</i></h1><p>Premium notebooks for students, creators and professionals. Thoughtful design, dependable paper and a style that makes every page feel important.</p><div className="heroBtns"><Link className="primary" to="/products">Explore Collection →</Link><a className="secondary" href="#about">Our Story</a></div><div className="heroMeta"><span>✓ Premium paper</span><span>✓ Student friendly</span><span>✓ Built to last</span></div></div>
    <div className="heroVisual"><div className="imageFrame"><img src={sampleNotebook} alt="Classonn+ notebook collection"/></div><div className="badge">WRITE<br/><b>CREATE</b><br/>REPEAT.</div></div>
  </section>
  <section className="stats"><div><b>200+</b><small>Premium pages</small></div><div><b>4.8★</b><small>Average rating</small></div><div><b>6+</b><small>Notebook styles</small></div><div><b>100%</b><small>Idea ready</small></div></section>
  <section id="categories" className="section"><div className="sectionHead"><div><small>SHOP BY TYPE</small><h2>One brand.<br/>Every kind of thinking.</h2></div><Link to="/products">View all →</Link></div><div className="cats">{['Academic','Premium','Spiral','Journal'].map((x,i)=><Link to="/products" className={'cat c'+i} key={x}><span>0{i+1}</span><div><h3>{x}</h3><p>{['For classes, revision & study.','For work, ideas & important moments.','Flexible pages. Easy everyday writing.','A private space for thoughts.'][i]}</p></div></Link>)}</div></section>
  <section id="about" className="about"><div className="aboutImage"><img src={sampleNotebook} alt="Classonn+ notebooks"/></div><div className="aboutCopy"><small>WHY CLASSonn+</small><h2>A notebook should feel like an invitation.</h2><p>We believe the right notebook changes how you think. Classonn+ brings together useful formats, premium paper and bold Indian-inspired colour to make everyday writing more enjoyable.</p><div className="features"><span><b>01</b><strong>Thoughtful design</strong><small>Clean layouts made for real life.</small></span><span><b>02</b><strong>Quality paper</strong><small>Smooth pages for effortless writing.</small></span><span><b>03</b><strong>Made for everyone</strong><small>Premium feel at practical prices.</small></span></div></div></section>
  <section className="quote"><small>THE CLASSonn+ PHILOSOPHY</small><h2>Every great idea<br/><i>starts on a page.</i></h2><Link className="primary" to="/products">Find your notebook →</Link></section>
</>}

function Contact(){return <>
  <section className="contact-hero">
    <h1>Get in <span>Touch</span></h1>
    <p>Have questions or want custom notebooks? Contact us anytime.</p>
  </section>
  <section className="contact-content">
    <div className="contact-facts">
      <article className="contact-card"><h2>Company</h2><p>Classonn Plus Group of Industry</p></article>
      <article className="contact-card"><h2>Email</h2><a href="mailto:classonnplus@gmail.com">classonnplus@gmail.com</a></article>
      <article className="contact-card"><h2>Phone</h2><a href="tel:+919130841801">+91 9130841801</a></article>
    </div>
    <div className="contact-offices">
      <article className="contact-card"><h2>Head Office</h2><p>Kabnur - Ichalkaranji,<br/>Kolhapur, Maharashtra</p></article>
      <article className="contact-card"><h2>Branch</h2><p>Takwade, Shirol,<br/>Kolhapur - 416121</p></article>
    </div>
    <div className="contact-actions">
      <a className="contact-call" href="tel:+919130841801">Call Now</a>
      <a className="contact-email" href="mailto:classonnplus@gmail.com">Email Us</a>
      <a className="contact-whatsapp" href="https://wa.me/919130841801" target="_blank" rel="noreferrer">WhatsApp</a>
    </div>
    <div className="contact-map">
      <iframe title="Map showing Kabnur, Ichalkaranji, Kolhapur" src="https://maps.google.com/maps?q=Kabnur%2C%20Ichalkaranji%2C%20Kolhapur%2C%20Maharashtra&t=&z=12&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <a href="https://www.google.com/maps/search/?api=1&query=Kabnur%2C+Ichalkaranji%2C+Kolhapur%2C+Maharashtra" target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
    </div>
  </section>
</>}

function Products({setCart}){const[p,setP]=useState([]),[search,setSearch]=useState(''),[cat,setCat]=useState('All');useEffect(()=>{axios.get(API+'/products',{params:{search,category:cat}}).then(r=>setP(r.data)).catch(()=>setP([]))},[search,cat]);const add=x=>setCart(c=>{let o=c.find(y=>y._id===x._id);return o?c.map(y=>y._id===x._id?{...y,quantity:y.quantity+1}:y):[...c,{...x,quantity:1}]});return <section className="page"><div className="heading"><small>THE COLLECTION</small><h1>Find your next notebook.</h1><p>Designed for study, work, planning and everything in between.</p></div><div className="filters"><input placeholder="Search notebooks..." value={search} onChange={e=>setSearch(e.target.value)}/>{['All','Academic','Premium','Spiral','Journal','Writing Pad'].map(x=><button className={cat===x?'on':''} onClick={()=>setCat(x)} key={x}>{x}</button>)}</div><div className="grid">{p.map(x=><article key={x._id}><Link to={'/products/'+x._id} className="book"><img src={sampleNotebook} alt="Notebook"/></Link><div className="productRow"><small>{x.category} • {x.pages} pages</small><span>★ {x.rating}</span></div><h3>{x.name}</h3><p>{x.description}</p><strong>{money(x.price)}</strong><button onClick={()=>add(x)}>+ Add to cart</button></article>)}</div>{!p.length&&<div className="empty">No notebooks found. Start the backend and seed the database.</div>}</section>}

function Detail({setCart}){let{id}=useParams(),[p,setP]=useState();useEffect(()=>{axios.get(API+'/products/'+id).then(r=>setP(r.data))},[id]);if(!p)return <div className="empty">Loading...</div>;return <section className="detail"><div className="detailVisual"><img src={sampleNotebook} alt={p.name}/></div><div><small>{p.category}</small><h1>{p.name}</h1><div className="priceLine">{money(p.price)} <span>★ {p.rating}</span></div><p>{p.description}</p><div className="specs"><span><small>Pages</small><b>{p.pages}</b></span><span><small>Size</small><b>{p.size}</b></span><span><small>Stock</small><b>{p.stock}</b></span></div><button className="primary" onClick={()=>setCart(c=>{let o=c.find(x=>x._id===p._id);return o?c.map(x=>x._id===p._id?{...x,quantity:x.quantity+1}:x):[...c,{...p,quantity:1}]})}>Add to Cart →</button></div></section>}

function Cart({cart,setCart,user}){
  let nav=useNavigate();
  const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const [placing,setPlacing]=useState(false),[error,setError]=useState('');
  const [customer,setCustomer]=useState({
    name:user?.name||'',
    email:user?.email||'',
    phone:'',
    address:{line1:'',line2:'',city:'',state:'',postalCode:'',country:'India'}
  });
  const updateAddress=(event)=>setCustomer(current=>({
    ...current,
    address:{...current.address,[event.target.name]:event.target.value}
  }));
  const checkout=async(event)=>{
    event.preventDefault();
    if(!user)return nav('/login');
    const token=localStorage.getItem('token');
    if(!token)return nav('/login');
    setError('');
    setPlacing(true);
    try{
      await axios.post(API+'/orders',{
        customer,
        items:cart.map(item=>({productId:item._id,quantity:item.quantity}))
      },{headers:{Authorization:`Bearer ${token}`}});
      setCart([]);
      alert('Order placed successfully!');
      nav('/');
    }catch(error){
      setError(error.response?.data?.message||'Unable to place your order. Please try again.');
    }finally{
      setPlacing(false);
    }
  };
  return <section className="page order-page">
    <div className="heading"><small>YOUR BAG</small><h1>Ready to write?</h1></div>
    {!cart.length
      ?<div className="empty">Your cart is empty. <Link to="/products">Explore notebooks</Link></div>
      :<div className="cart cart-layout">
        <div className="cartItems">{cart.map(item=><div className="cartItem" key={item._id}>
          <div className="tiny"></div>
          <div className="cartMeta">
            <span className="cartItemTitle"><b>{item.name}</b></span>
            <small>{money(item.price)} × {item.quantity}</small>
          </div>
          <strong>{money(item.price*item.quantity)}</strong>
          <button onClick={()=>setCart(current=>current.filter(product=>product._id!==item._id))} aria-label={`Remove ${item.name}`}>×</button>
        </div>)}</div>
        <aside className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><b>{money(total)}</b></div>
          <div className="summary-row"><span>Delivery</span><b>FREE</b></div>
          <div className="summary-divider"></div>
          <div className="summary-row total-row"><span>Total</span><b>{money(total)}</b></div>
          <form className="customer-form" onSubmit={checkout}>
            <h3>Customer &amp; delivery details</h3>
            <label>Full name<input name="name" autoComplete="name" value={customer.name} onChange={event=>setCustomer(current=>({...current,name:event.target.value}))} required/></label>
            <label>Email address<input name="email" type="email" autoComplete="email" value={customer.email} onChange={event=>setCustomer(current=>({...current,email:event.target.value}))} required/></label>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" value={customer.phone} onChange={event=>setCustomer(current=>({...current,phone:event.target.value}))} required/></label>
            <label>Address line 1<input name="line1" autoComplete="address-line1" value={customer.address.line1} onChange={updateAddress} required/></label>
            <label>Address line 2 (optional)<input name="line2" autoComplete="address-line2" value={customer.address.line2} onChange={updateAddress}/></label>
            <div className="customer-address-row">
              <label>City<input name="city" autoComplete="address-level2" value={customer.address.city} onChange={updateAddress} required/></label>
              <label>State<input name="state" autoComplete="address-level1" value={customer.address.state} onChange={updateAddress} required/></label>
            </div>
            <div className="customer-address-row">
              <label>Postal code<input name="postalCode" autoComplete="postal-code" value={customer.address.postalCode} onChange={updateAddress} required/></label>
              <label>Country<input name="country" autoComplete="country-name" value={customer.address.country} onChange={updateAddress} required/></label>
            </div>
            {error&&<div className="error" role="alert">{error}</div>}
            <button className="primary checkout-btn" type="submit" disabled={placing}>{placing?'Placing order...':'Place Order'}</button>
          </form>
        </aside>
      </div>}
  </section>;
}

function Auth({mode,setUser}){let nav=useNavigate(),[f,setF]=useState({name:'',email:'',password:''}),[err,setErr]=useState('');let go=async e=>{e.preventDefault();try{let r=await axios.post(API+'/auth/'+(mode==='login'?'login':'register'),f);localStorage.setItem('token',r.data.token);localStorage.setItem('user',JSON.stringify(r.data.user));setUser(r.data.user);nav('/')}catch(e){setErr(e.response?.data?.message||'Unable to continue')}};return <section className="auth"><form onSubmit={go}><img src={logo} alt="Classonn+"/><small>{mode==='login'?'WELCOME BACK':'JOIN CLASSonn+'}</small><h1>{mode==='login'?'Sign in':'Create account'}</h1>{mode==='register'&&<input placeholder="Full name" required onChange={e=>setF({...f,name:e.target.value})}/>}<input type="email" placeholder="Email" required onChange={e=>setF({...f,email:e.target.value})}/><input type="password" placeholder="Password" required onChange={e=>setF({...f,password:e.target.value})}/>{err&&<div className="error">{err}</div>}<button className="primary">{mode==='login'?'Sign In →':'Create Account →'}</button><p><Link to={mode==='login'?'/register':'/login'}>{mode==='login'?'Create an account':'Sign in instead'}</Link></p></form></section>}

const cartStorageKey=user=>`classonn:cart:${user?.id||'guest'}`;
function readCart(key){try{const saved=localStorage.getItem(key);if(saved!==null){const cart=JSON.parse(saved);return Array.isArray(cart)?cart:[]}if(key==='classonn:cart:guest'){const legacy=localStorage.getItem('cart');if(legacy!==null){const cart=JSON.parse(legacy);if(Array.isArray(cart)){localStorage.setItem(key,JSON.stringify(cart));localStorage.removeItem('cart');return cart}}}return []}catch(error){console.warn('Unable to load saved cart:',error);return []}}
function readUser(){try{return JSON.parse(localStorage.getItem('user')||'null')}catch(error){console.warn('Unable to load saved user:',error);return null}}
function App(){const initialUser=readUser(),[cart,setCartState]=useState(()=>readCart(cartStorageKey(initialUser))),[user,setUserState]=useState(initialUser),cartOwner=React.useRef(cartStorageKey(initialUser)),cartRef=React.useRef(cart);const setCart=update=>{const next=typeof update==='function'?update(cartRef.current):update;cartRef.current=next;localStorage.setItem(cartOwner.current,JSON.stringify(next));setCartState(next)};const setUser=nextUser=>{const nextOwner=cartStorageKey(nextUser);if(nextOwner!==cartOwner.current){cartOwner.current=nextOwner;const nextCart=readCart(nextOwner);cartRef.current=nextCart;setCartState(nextCart)}setUserState(nextUser)};return <><Nav cart={cart} user={user} setUser={setUser}/><Routes><Route path="/" element={<Home/>}/><Route path="/contact" element={<Contact/>}/><Route path="/products" element={<Products setCart={setCart}/>}/><Route path="/products/:id" element={<Detail setCart={setCart}/>}/><Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user}/>}/><Route path="/login" element={<Auth mode="login" setUser={setUser}/>}/><Route path="/register" element={<Auth mode="register" setUser={setUser}/>}/></Routes><footer><img src={logo} alt="Classonn+"/><p>Write your ideas. Create your future.</p><small>Classonn Plus Group of Industry · <a href="mailto:classonnplus@gmail.com">classonnplus@gmail.com</a> · <a href="tel:+919130841801">+91 9130841801</a></small></footer></>}

createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
