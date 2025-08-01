import { useContext, useState, useEffect, useRef } from 'react';
import './Search.css'
import { StoreContext } from '../../context/storeContext';
import { X, Search as SearchIcon } from 'lucide-react';


const Search = ({searchOpen,setSearchOpen}) => {
    const { setSearchQuery } = useContext(StoreContext);
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    const handleSearch = (e) => {
      e.preventDefault();
      setSearchQuery(query);
      setSearchOpen(false);
    };

    const handleSearchClick = () => {
      if (inputRef.current) {
          inputRef.current.focus(); // Focus the input element
        }
    };

    useEffect(() => {
      if (searchOpen) {
        handleSearchClick();
      }
    }, [searchOpen]);

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSearch(event);
      }
    };

  return (
    <div className="search_wrapper">
        <div className="search_close" onClick={() => setSearchOpen(false)}>
            <ion-icon name='close'></ion-icon>
        </div>
        <div className="search_box">
          <form onSubmit={handleSearch}> 
            <SearchIcon size={20} strokeWidth={1.75} />
            <input type="text" placeholder='Search Images...' value={query} onChange={(e) => setQuery(e.target.value)} ref={inputRef} onKeyPress={handleKeyPress}/>
            {
                query.length > 0 ? <X size={20} strokeWidth={1.75} onClick={() => setQuery('')}/> : null
            }
            <button type='submit'><SearchIcon className='srch_icon' size={20} strokeWidth={1.75} /><span>Search</span></button>
          </form>
        </div>
    </div>
  )
}

export default Search
