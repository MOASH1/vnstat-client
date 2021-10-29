import { useState } from "react";
import Chart from "../components/Chart";
import useFilterDate from "../hooks/useFilterDate";

import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

import { Flex, IconButton, Heading, Box, Button } from "@chakra-ui/react";
import { GrPowerReset } from "react-icons/gr";

import { format, subDays } from "date-fns";

export default function Hour({ _data }) {
	const [previousDays, setPreviousDays] = useState(0);
	const Data = useFilterDate(_data, "today", previousDays);

	const lineChartData = [
		{
			id: "Upload",
			color: "hsl(227, 18%, 50%)",
			data: Data.map((e) => ({
				x: new Date(e.date).getHours() + 1,
				y: (e.tx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: Data.filter((e) => e.interface === 2).map((e) => ({
				x: new Date(e.date).getHours() + 1,

				y: (e.rx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = Data.filter((e) => e.interface === 2).map((e) => ({
		date: new Date(e.date).getHours() + 1,
		Download: (e.rx / 1024 / 1024 / 1024).toFixed(2),
		Upload: (e.tx / 1024 / 1024 / 1024).toFixed(2),
	}));

	return (
		<>
			<Flex justify='space-around' w='full' mb={4}>
				<Box w='30px'>
					<IconButton
						variant='ghost'
						icon={<HiArrowLeft size='1.4em' />}
						onClick={() => setPreviousDays(previousDays + 1)}
					/>
				</Box>
				<Flex flexDir='column' alignItems='center'>
					<Heading>
						{format(subDays(new Date(), previousDays), "MMM dd")}
					</Heading>
					<Button
						size='xs'
						variant='ghost'
						leftIcon={<GrPowerReset />}
						onClick={() => setPreviousDays(0)}>
						Reset
					</Button>
				</Flex>
				<Box w='30px'>
					{previousDays > 0 && (
						<IconButton
							variant='ghost'
							icon={<HiArrowRight size='1.4em' />}
							onClick={() => setPreviousDays(previousDays - 1)}
						/>
					)}
				</Box>
			</Flex>
			<Chart lineChartData={lineChartData} barChartData={barChartData} />
		</>
	);
}

export async function getStaticProps() {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hour`);
	const _data = await response.json();

	return {
		props: {
			_data,
		},
	};
}
