// 'YYYY-MM-DD'
export const holidays = [
	'2024-01-01', // Confraternização Universal (Ano Novo)
	'2024-02-12', // Carnaval
	'2024-02-13', // Carnaval
	'2024-03-29', // Sexta-feira Santa
	'2024-04-21', // Tiradentes
	'2024-05-01', // Dia do Trabalho
	'2024-05-30', // Corpus Christi
	'2024-09-07', // Independência do Brasil
	'2024-10-12', // Nossa Senhora Aparecida (Padroeira do Brasil)
	'2024-11-02', // Finados
	'2024-11-15', // Proclamação da República
	'2024-12-25', // Natal
];

/**
 * Verifica se uma data é um feriado.
 * @param date - A data a ser verificada
 * @returns true se a data for um feriado, caso contrário false
 */
export function isHoliday(date: Date): boolean {
	const dateString = date.toISOString().split('T')[0];
	return holidays.includes(dateString);
}
