# Create Response Headers Policy
aws cloudfront create-response-headers-policy --response-headers-policy-config file://cloudfront-response-headers.json

# Get your distribution config
aws cloudfront get-distribution-config --id E392GN8WO32SVW > distribution-config.json

# Update distribution with new policy (after getting policy ID from first command)
# Replace POLICY_ID with the ID returned from create-response-headers-policy
aws cloudfront update-distribution --id E392GN8WO32SVW --distribution-config file://updated-distribution-config.json --if-match ETAG_FROM_GET_COMMAND

# Alternative: List existing policies to use a managed one
aws cloudfront list-response-headers-policies --type managed

# Use managed CORS policy (simpler approach)
# Get distribution config, edit it to add ResponseHeadersPolicyId: "60669652-455b-4ae9-85a4-c4c02393f86c" (Managed-CORS-With-Preflight)
# Then update distribution