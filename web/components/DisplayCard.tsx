import { Card, Image, Text, ActionIcon, Group, Tooltip, Chip } from '@mantine/core';
import { IconArrowBarToDown } from "@tabler/icons-react"

type DisplayCardProps = {
    imgSrc: string;
    fileName: string;
}

function DisplayCard({ imgSrc, fileName }: DisplayCardProps){

    function downloadImages(){

        if (document) {
            let a = document.createElement("a");
            (a as any).style = "display: none";
            document.body.appendChild(a);
            a.href = imgSrc;
            a.download = "fileName";
            a.click();
            window.URL.revokeObjectURL(imgSrc);
        }

    }

    return (
        <>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
        
            <Text weight={500} fw={300}>
                Result
            </Text>
   
            <Group position="center" mt="md" mb="xs">
                <Image
                    src={imgSrc}
                    height={imgSrc === "" ? 300 : "100%"}
                    alt="downloadImages"
                    withPlaceholder
                />
            </Group>

            {fileName &&  
                <Chip checked defaultChecked variant="light" color="green">{fileName}</Chip>
            }

            { imgSrc !== "" && (
                <Group position="right">
                    <Tooltip label={"Download images"}>
                    <ActionIcon onClick={ () => downloadImages() }>
                        <IconArrowBarToDown size="1.125rem" />
                    </ActionIcon>
                    </Tooltip>
                </Group>
            )}       

        </Card>
        </>
    )
}
    
export default DisplayCard
