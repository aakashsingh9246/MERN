import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: { school, fieldofstudy, from, to, description }
}) => {
  return (
    <div>
      <h3 className='text-dark'>{school}</h3>
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
        <strong>Field Of Study: </strong>
        {fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired
};

export default ProfileEducation;
