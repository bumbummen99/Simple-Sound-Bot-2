import fetch from "node-fetch";

declare type ReleasesResponse = Release[];

declare type Release = {
    assets: Asset[]
};

declare type Asset = {
    name: string,
    browser_download_url: string
}

export default async function getLatestRelease(repo: string, file: string): Promise<string|null>
{
    const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=1`);
    if (response.ok) {
        const json = await response.json() as ReleasesResponse;

        if (json.length && json[0].assets.length) {
            const asset = json[0].assets.find(asset => asset.name === file);
            if (asset) {
                return asset.browser_download_url;
            }
        }
    }

    return null;
}