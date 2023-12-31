import { getInfoForAfterEvents, insightsClient, searchClient, searchConfig } from "../../../lib/algoliaConfig";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { addProductToLocalStorageCart } from "../../../lib/common";

export async function getServerSideProps({ query }) {
  const { products } = query;
  const objectId = products.pop();

  const index = searchClient.initIndex(searchConfig.recordsIndex);
  const product = await index.getObject(objectId);


  return {
    props: {
      hit: product
    }
  }
}

/**
 * Product Detail Page
 * @param {} param0
 * @returns
 */
function ProductDetailPage({ hit }) {

  const handleAddToCartAfterSearch = () => {
    const storedInfo = getInfoForAfterEvents();
    if (storedInfo && storedInfo.queryId) {
      insightsClient('addedToCartObjectIDsAfterSearch', {
        index: storedInfo.indexName,
        eventName: 'pdp_add_to_cart',
        queryID: storedInfo.queryId,
        objectIDs: storedInfo.objectIDs,
        objectData: [
          {
            // The discount value for this item, if applicable
            discount: hit.discount || 0,
            // The price value for this item (minus the discount)
            price: hit.price.value,
            // How many of this item were added
            quantity: 2,
          },
        ],
        // The total value of all items
        value: hit.price.value * 2,
        currency: 'USD',
      });
    }
    addProductToLocalStorageCart(hit);
  }

  const handlePurchaseAfterSearch = () => {
    const storedInfo = getInfoForAfterEvents();
    if (storedInfo && storedInfo.queryId) {
      insightsClient('purchasedObjectIDsAfterSearch', {
        index: storedInfo.indexName,
        eventName: 'pdp_buy_now',
        objectIDs: storedInfo.objectIDs,
        objectData: [
          {
            // The discount value for this item, if applicable
            discount: hit.discount || 0,
            // The price value for this item (minus the discount)
            price: hit.price.value,
            // The query ID
            queryID: storedInfo.queryId,
            // How many of this item were added
            quantity: 1,
          },
        ],
        // The total value of all items
        value: hit.price.value * 1,
        currency: 'USD',
      });
    }
  }

  const handleClickAfterSearch = () => {
    const storedInfo = getInfoForAfterEvents();
    if (storedInfo && storedInfo.queryId) {
      insightsClient('clickedObjectIDsAfterSearch', {
        index: storedInfo.indexName,
        eventName: 'pdp_click',
        queryID: storedInfo.queryId,
        objectIDs: storedInfo.objectIDs,
        positions: storedInfo.positions,
      });
    }
  }

  return (
    <>
      <div className="pdp-hit">
        <div className="pdp-hit-content">
          <div className="pdp-note">
            <p>Products data shoudln't come from Algolia. We are using <strong>getObject()</strong> for demo purposes. Don't use this approach in production.</p>
          </div>
          <div>
            <h1>{hit.name}</h1>
          </div>
          <div className="pdp-hit-pictures">
            <Carousel showArrows={true} showThumbs={true} axis={"horizontal"} centerMode="false" autoPlay={true} emulateTouch={true} onClickItem={handleClickAfterSearch} onClickThumb={handleClickAfterSearch}>
              {hit.image_urls.filter(u => u.length ).map((url, index) => (
                <div key={index}>
                  <img src={url} alt={`Image ${index}`} />
                  <p className="legend">${hit.price.value}</p>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="pdp-hit-type">
            <span>{hit.type}</span>
          </div>
          <p className='product-actions'>
            <button className="conversion-btn"
              onClick={() => {
                handleAddToCartAfterSearch();
              }}>Add to cart</button>
          </p>
          <p className='product-actions'>
            <button className="conversion-btn buy-now-btn"
              onClick={() => {
                handlePurchaseAfterSearch();
              }}>Buy now</button>
          </p>
        </div>
      </div>
    </>

  );
}

export default ProductDetailPage;