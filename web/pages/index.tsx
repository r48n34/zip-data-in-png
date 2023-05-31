import Head from 'next/head'
import UploadFormComp from '@/components/UploadFormComp'
import { Container } from '@mantine/core'

export default function Home() {
  return (
    <>
      <Head>
        <title>zip-data-in-png</title>
        <meta name="description" content="zip-data-in-png web version" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size={"lg"}>
        
        <UploadFormComp/>
      </Container>
    </>
  )
}
