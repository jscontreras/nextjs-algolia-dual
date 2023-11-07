import { Highlight } from "react-instantsearch";
import { searchConfig, storeInfoForAfterEvents } from "../../lib/algoliaConfig";
import singletonRouter from 'next/router';
import Rating from "./Rating";
import { addProductToLocalStorageCart } from "../../lib/common";

export const HitComponent = ({ hit, sendEvent }) => {
  function handleObjectClick(item) {
    if (typeof document !== 'undefined') {
      storeInfoForAfterEvents({
        queryId: item.__queryID,
        objectIDs: [item.objectID],
        positions: [item.__position],
        indexName: item.__indexName,
      });
      singletonRouter.push(`${searchConfig.productPdpPathPrefix}/${item.slug}/${item.objectID}`)
    }
  }
  return (<div className="hit" onClick={() => handleObjectClick(hit)}>
    <div className="hit-picture">
      <img src={`${hit.image_urls[0]}`} alt={hit.name} width={100} height={100} />
    </div>
    <div className="hit-content">
      <div className="aa-ItemId">{hit.objectID}</div>
      <div>
        <Rating value={hit.reviews.rating} />
      </div>
      <div>
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="hit-type">
        <Highlight attribute="type" hit={hit} />
      </div>
      <div className="hit-description">
        {/* <span> - {hit.rating} stars</span> */}
        <span> - ${hit.price.value}</span>
      </div>
    </div>
    <p className='product-actions'>
      <button className="conversion-btn"
        onClick={(ev) => {
          ev.preventDefault();
          // sendEvent('conversion', hit, 'Product Ordered');
          sendEvent('conversion', hit, 'Added To Cart', {
            // Special subtype
            eventSubtype: 'addToCart',
            // An array of objects representing each item added to the cart
            objectData: [
              {
                // The discount value for this item, if applicable
                discount: hit.discount || 0,
                // The price value for this item (minus the discount)
                price: hit.price.value,
                // How many of this item were added
                quantity: 1,
              },
            ],
            // The total value of all items
            value: hit.price * 1,
            // The currency code
            currency: 'USD',
          });
          addProductToLocalStorageCart(hit);
          ev.stopPropagation();
        }}>Add to cart</button>
    </p>
  </div>)
};
