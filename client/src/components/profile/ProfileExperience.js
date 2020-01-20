import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
  experience: { title, company, from, to, description }
}) => {
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <p>
        <Fragment>
          <Moment format='YYYY/MM/DD'>{from}</Moment>
          {from}
        </Fragment>{' '}
        -{' '}
        {!to ? (
          ' Now'
        ) : (
          <Fragment>
            <Moment format='YYYY/MM/DD'>{to}</Moment>
          </Fragment>
        )}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
