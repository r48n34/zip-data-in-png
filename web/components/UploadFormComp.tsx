import { Button, Group, Box, FileInput, Text, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { IconUpload, IconFileUpload } from '@tabler/icons-react';

import toast from 'react-hot-toast';
import DisplayCard from './DisplayCard';

interface FormObject {
    file: File | null
    hidden: File | null
}

function UploadFormComp() {

    const [ imagesBlobUrl, setImagesBlobUrl ] = useState<string | null>("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ currentFileName, setCurrentFileName ] = useState<string>("");

    const form = useForm<FormObject>({
        initialValues: {
            file: null,
            hidden: null,
        },
        validate: {
            file: (value) => (
                !value 
                ? 'Missing png file'
                : value.size / 1024 / 1024 >= 6 // in MiB 
                ? 'png file too big'
                : null
            ),
            hidden: (value) => (
                !value 
                ? 'Missing zip file'
                : value.size / 1024 / 1024 >= 3 // in MiB 
                ? 'zip file too big'
                : null
            ),
        },
    });

    async function uploadform(values: FormObject) {

        try {
            setIsLoading(true);
    
            const formData = new FormData();
            formData.append("file", values.file as any)
            formData.append("hidden", values.hidden as any)

            const res = await fetch("/api/hidePngZip", {
                method: "POST",
                body: formData,
            });

            if(res.status === 200){
                const data = await res.blob();  

                if(data.size <= 1){
                    toast.error("Server error. Please try another file")
                    return;
                }
                
                setCurrentFileName(values.hidden!.name);
                toast.success("Enjoy your files!");
                setImagesBlobUrl(URL.createObjectURL(data));
            }
            else {
                const data = await res.json();
                toast.error(data.error, { position: 'top-right' })
            }

        } 
        catch (error) {
            toast.error("Error. Please try another file", { position: 'top-right' })
        }
        finally{
            setIsLoading(false)
        }
        
        
    }

    return (
        <>
        <Text ta={"center"} fz={34} fw={300} mb={32} mt={4}> zip-data-in-png </Text>
        <Text ta={"center"} fz={14} fw={300} mt={-34} c='dimmed'> Hide a zip file in your png files </Text>

        <Grid gutter="xl" mt={12}>
            <Grid.Col md={7}>
                <Box mx="auto" mt={32}>

                <form onSubmit={form.onSubmit((values) => uploadform(values))}>

                    <FileInput
                        disabled={isLoading}
                        placeholder="hello.png"
                        label="Png file"
                        withAsterisk
                        accept="image/png"
                        icon={<IconUpload size={12} />}
                        {...form.getInputProps('file')}
                    />
                    <Text c="dimmed" fz="xs" mt={4}>Should not be bigger than 6MB</Text>

                    <FileInput
                        mt={22}
                        disabled={isLoading}
                        placeholder="hidden.zip"
                        label="Zip file"
                        withAsterisk
                        accept=".zip"
                        icon={<IconUpload size={12} />}
                        {...form.getInputProps('hidden')}
                    />
                    <Text c="dimmed" fz="xs" mt={4}>1. Should not be bigger than 3MB</Text>
                    <Text c="dimmed" fz="xs" mt={4}>2. Zip file size should NOT bigger than png file (width * height)</Text>

                    <Group position="right" mb={16} mt={22}>
                        <Button leftIcon={<IconFileUpload />} variant="light" type="submit" loading={isLoading}>
                            { isLoading ? "Processing" : "Upload" }
                        </Button>
                    </Group>
                    
                </form>
                </Box>
            </Grid.Col>

            <Grid.Col md={5}>
                <DisplayCard imgSrc={imagesBlobUrl || ""} fileName={currentFileName}/>
            </Grid.Col>

        </Grid>
        </>
    );
}

export default UploadFormComp