import Link from 'next/link';
import { searchConfig } from '../lib/algoliaConfig';


export default function Home() {
  return <div className="page_container">
    <div className=" page_content" >
      <h1>NextJS SRR Algolia Demo</h1>
      <br></br>
      <p>This is any other page different than {searchConfig.searchPagePath} or any category (catalog) page.</p>
      <br></br>
      <p>Upon search, the user will be redirected to the search page passing the query as an URL value.</p>
    </div>
    <ol className='example-links'>
      <li>
        <Link href="/algolia/search">
          Search Bar + Search Results experience.
        </Link>
      </li>
      <li>
        <Link href="/algolia/c/women/bags">
          {`Women > Bags Category Page.`}
        </Link>
      </li>
    </ol>
  </div>
}