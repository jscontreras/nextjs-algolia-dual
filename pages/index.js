import Link from 'next/link';
import { searchConfig } from '../lib/algoliaConfig';

import { useRouter } from 'next/router';
import { ClientLink } from '../components/links/Clientlink';
import { ActiveLink } from '../components/links/ActiveLink';

export default function Home() {
  const router = useRouter();
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
      <li>
        <ActiveLink href="/algolia/c/men/shoes" router={router}>
          {`Men > shoes Category Page.`}
        </ActiveLink>
      </li>
      <li>
        <ClientLink href="/algolia/c/women/shoes">
          {`Women > shoes Category Page.`}
        </ClientLink>
      </li>
    </ol>
  </div>
}