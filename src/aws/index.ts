import regions from './regions.json';

function list () {
	return regions.filter((region: Region) => {
		return !(!region.public);
	})
}

function lookup (opts: Options) {
	if (opts.code) {
		return regions.find((r: Region) => r.code === opts.code)
	}
	
	if (opts.name) {
		return regions.find((r: Region) => r.name === opts.name)
	}

	if (opts.full_name) {
		return regions.find((r: Region) => r.full_name === opts.full_name)
	}
}

function get (nameOrCode: string) {
	console.warn(".get() method is deprecated! Use .lookup({ code: '' }) or .lookup({ name: '' }) instead.")
	
	return nameOrCode.match(/[0-9]$/)
		? lookup({ code: nameOrCode })
		: lookup({ name: nameOrCode })
}

export {list, lookup, get};
