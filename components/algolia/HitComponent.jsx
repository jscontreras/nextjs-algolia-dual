import { Highlight } from "react-instantsearch";
import { searchConfig } from "../../lib/algoliaConfig";

export const HitComponent = ({ hit, sendEvent }) => (
  <div className="hit">
    <a href={`${searchConfig.productPdpPathPrefix}/${hit.slug}/${hit.objectID}`} className='main-click--handler'>
      <div className="hit-picture">
        <img src={`${hit.image_urls[0]}`} alt={hit.name} width={100} height={100} />
      </div>
      <div className="hit-content">
        <div className="aa-ItemId">{hit.objectID}</div>
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
        <p className='product-actions'>
          <button className="conversion-btn"
            onClick={(ev) => {
              ev.preventDefault();
              sendEvent('conversion', hit, 'Product Ordered');
              ev.stopPropagation();
            }}>Add to cart</button>
        </p>
      </div>
    </a>
  </div>
);
