import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout';

export default function App(props: AppProps) {
    const { Component, pageProps } = props;

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return (
        <>
            <Head>
                <title>zip-data-in-png</title>
                <meta name="description" content="zip-data-in-png web version" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                <Layout>
                    <Toaster />
                    <Component {...pageProps} />
                </Layout>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}