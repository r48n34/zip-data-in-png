import formidable from 'formidable'
import { NextApiRequest } from 'next'

export class FormService {
	parseRequest(req: NextApiRequest) {
		const form = new formidable.IncomingForm({
			maxFileSize: 1024 * 1024 * 12 // (12 MB Max)
		})

		return new Promise<[formidable.Fields, formidable.Files]>(
			(resolve, reject) => {
				form.parse(req, (err, fields, files) => {
					if (err) {
						reject(err)
					} else {
						resolve([fields, files])
					}
				})
			}
		)
	}
}

export const formService = new FormService()
