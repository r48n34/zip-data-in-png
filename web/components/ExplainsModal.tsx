import { useDisclosure } from '@mantine/hooks';
import { Tooltip, Modal, ActionIcon, Text, Space } from '@mantine/core';
import { IconUserQuestion } from '@tabler/icons-react';

function ExplainsModal(){
    const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
        <Modal opened={opened} onClose={close} title="zip-data-in-png" size={"60%"}>

            <Text fz={18} fw={300} >
                Pack up to 3MB of data into a tweetable PNG polyglot file.
            </Text>

            <Text fz={28} fw={300} ta="center">
                Error Q&A
            </Text>

            <Text fz={16} fw={300}>
                Q: Error: Invalid CEN header (bad signature)
            </Text>

            <Text fz={16} fw={300}>
                A: If the png file already contains zip file, there is a high chances that this error occur.
            </Text>

            <Space h="md" />

            <Text fz={16} fw={300}>
                Q: ERROR: Input files too big for cover image resolution.
            </Text>

            <Text fz={16} fw={300}>
                A: Zip file size should NOT bigger than png file (width * height)
            </Text>

            <Text fz={16} fw={300} mt={48}>
                Policy: We will not save all your uploaded files and images. Feel free to use. 
            </Text>

            <Text fz={12} fw={300} component="a" href="https://github.com/DavidBuchanan314/tweetable-polyglot-png">
                Original Repo: https://github.com/DavidBuchanan314/tweetable-polyglot-png
            </Text>

        </Modal>

        <Tooltip label={"What is it?"}>
        <ActionIcon
            variant="light"
            onClick={open}
        >
            <IconUserQuestion size={16} />
        </ActionIcon>
        </Tooltip>
    </>
  );
}
    
export default ExplainsModal
