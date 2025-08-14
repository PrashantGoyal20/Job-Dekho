import React ,{useEffect,useState,useContext} from 'react'
import "./homepage.css"
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import {Context} from '../../main'
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {

  const server=import.meta.env.VITE_APP_SERVER
  const [searchTerm,setSearchTerm ] =useState("")
  const [location,setLocation]=useState('')
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const {setTerm} =useContext(Context);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${server}/search?q=${searchTerm}`);
        setData(response.data);
      } catch (error) {
        Alert("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
  }, [searchTerm]);

  const handleSearch = (searchTerm,location) => {
    if(searchTerm.length!=0 && location.length!=0){
    navigate(`/allJobs?job=${searchTerm}&location=${location}`)}
    else if(searchTerm.length!=0){
      navigate(`/allJobs?job=${searchTerm}`)
    }
    else if(location.length!=0){
      navigate(`/allJobs?location=${location}`)
    }
    else if(searchTerm.length==0 && location.length==0){
      return
    }

  };
  

  return (

      <section class="hero-section">
        <div class="hero-content">
            <div class="hero-text">
                <h2 class="hero-title">
                    <span class="title-line">Discover Your</span>
                    <span class="title-line gradient-text">Future Career</span>
                </h2>
                <p class="hero-subtitle">Connect with revolutionary companies and shape tomorrow's technology</p>
            </div>
            
            <div class="search-container">
                <div class="search-glow"></div>
                <div class="search-bar">
                    <div class="search-input-group">
                        <div class="input-wrapper">
                            <span class="input-icon">🔍</span>
                            <input type="text" id="job-search" placeholder="AI Engineer, Blockchain Developer..." class="search-input" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
                        </div>
                        <div class="input-wrapper">
                            <span class="input-icon">📍</span>
                            <input type="text" id="location-search" placeholder="Location, Remote..." class="search-input" value={location} onChange={(e)=>setLocation(e.target.value)}/>
                        </div>
                        <button class="search-btn" onMouseDown={() => handleSearch(searchTerm,location)} onKeyDown={() => handleSearch(searchTerm,location)} >
                            <span class="btn-text">Search</span>
                            <div class="btn-effect"></div>
                        </button>
                    </div>
                </div>
                
                
            </div>
        </div>
    </section>

  )
}

export default SearchBar