export declare const ClusterSubnetsType: {
    readonly Private: "private";
    readonly Public: "public";
};
/**
 * The subnet type
 */
export declare type ClusterSubnetsType = (typeof ClusterSubnetsType)[keyof typeof ClusterSubnetsType];
