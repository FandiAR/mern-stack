import { useState, useEffect } from 'react';
import RestaurantDataService from 'services/restaurant';
import { Link } from 'react-router-dom';

const Restaurant = (props) => {
  const { match, user } = props;
  const initialRestaurantState = {
    id: null,
    name: '',
    address: {},
    cuisine: '',
    reviews: []
  };
  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  const getRestaurant = (id) => {
    RestaurantDataService.get(id)
      .then((response) => {
        setRestaurant(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getRestaurant(match.params.id);
  }, [match.params.id]);

  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then(() => {
        setRestaurant((prevState) => {
          prevState.reviews.splice(index, 1)
          return ({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {restaurant ? (
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>{restaurant.cuisine}<br />
            <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
          </p>
          <Link to={"/restaurants/" + match.params.id + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => (
                <div className="col-lg-4 pb-1" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <p className="card-text">
                        {review.text}<br />
                        <strong>User: </strong>{review.name}<br />
                        <strong>Date: </strong>{review.date}
                      </p>
                      {user && user.id === review.user_id &&
                        <div className="row">
                          <p role="presentation" onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</p>
                          <Link to={{
                            pathname: "/restaurants/" + match.params.id + "/review",
                            state: {
                              currentReview: review
                            }
                          }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-sm-4">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;