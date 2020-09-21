import React from 'react';
import styles from './Home.css';

export const Header = (props: any) => {
  const { search, setSearch } = props;

  return (
    <div className={styles.header}>
      <input
        className={styles.searchInput}
        placeholder="Search"
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(ev.target.value);
        }}
        value={search}
      />
    </div>
  );
};

export default Header;
