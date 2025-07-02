import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getFileByS3Url, getPrivateKey } from "./common.js";

const CLOUDFRONT_DISTRIBUTION = process.env.CLOUDFRONT_DISTRIBUTION;
const PUBLIC_KEY_PAIR_ID = process.env.PUBLIC_KEY_PAIR_ID;

export const signedUrl = async({url, timeToAdd}) => {
    const cloudfrontDistributionDomain = CLOUDFRONT_DISTRIBUTION;
    const s3ObjectKey = getFileByS3Url(url);
    const cloudfrontUrl = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
    const privateKey = await getPrivateKey();
    const keyPairId = PUBLIC_KEY_PAIR_ID;
    const dateLessThan = new Date(Date.now() + timeToAdd);
    const newUrl = getSignedUrl({
        url: cloudfrontUrl,
        keyPairId,
        dateLessThan,
        privateKey,
    });
    return newUrl;
}