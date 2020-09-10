import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './logReader.css';
import routes from '../../constants/routes.json';
import { selectLog } from './logReaderSlice';

export default function Counter() {
  const value = useSelector(selectLog);
  return (
    <div>
      <div className={styles.backButton} data-tid="backButton">
        <Link to={routes.HOME}>
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
      </div>
      <div className={`counter ${styles.counter}`} data-tid="counter">
        {value}
      </div>
    </div>
  );
}
