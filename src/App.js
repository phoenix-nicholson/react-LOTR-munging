import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';

import CharacterList from './components/Characters/CharacterList';
import FilmList from './components/Films/FilmList';

function App() {
  const [films, setFilms] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const getFilms = async () => {
      const resp = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/films`, {
        headers: {
          apikey: process.env.REACT_APP_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
        },
      });

      const data = await resp.json();

      const newData = data.map((item) => [
        item.title,
        item.title.toLowerCase().replace(/ /g, '-'),
        item.academy_award_nominations,
        item.box_office_total,
      ]);

      setFilms(newData);
      return [films];
    };
    const getCharacters = async () => {
      const resp = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/characters`, {
        headers: {
          apikey: process.env.REACT_APP_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
        },
      });
      const data = await resp.json();

      const newData = data.map((item) => {
        if (item.birth === item.death) {
          return [item.name, (item.dates = 'Unknown')];
        } else {
          return [item.name, (item.dates = `${item.birth}-${item.death}`)];
        }
      });

      setCharacters(newData);
      return [characters];
    };

    getFilms();
    getCharacters();
  }, [characters, films]);

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavLink to="/films" data-testid="film-link">
            Films
          </NavLink>
          <NavLink to="/characters" data-testid="char-link">
            Characters
          </NavLink>
        </header>
        {
          <Switch>
            <Route path="/films">
              <FilmList films={films} />
            </Route>
            <Route path="/characters">
              <CharacterList characters={characters} />
            </Route>
          </Switch>
        }
      </BrowserRouter>
    </div>
  );
}

export default App;
