"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function SwaggerUI() {
  const [spec, setSpec] = useState<any>(null)

  useEffect(() => {
    fetch("/api/swagger")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((error) => console.error("Failed to load API spec:", error))
  }, [])

  if (!spec) {
    return <div>Loading API documentation...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Title:</strong> {spec.info.title}</p>
          <p><strong>Version:</strong> {spec.info.version}</p>
          <p><strong>Description:</strong> {spec.info.description}</p>
        </CardContent>
      </Card>

      {Object.entries(spec.paths).map(([path, methods]: [string, any]) => (
        <Card key={path}>
          <CardHeader>
            <CardTitle className="text-lg">{path}</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(methods).map(([method, details]: [string, any]) => (
              <div key={method} className="mb-4 p-4 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded font-mono ${
                    method === 'get' ? 'bg-blue-100 text-blue-800' :
                    method === 'post' ? 'bg-green-100 text-green-800' :
                    method === 'put' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {method.toUpperCase()}
                  </span>
                  <span className="font-semibold">{details.summary}</span>
                </div>
                {details.tags && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Tags: {details.tags.join(', ')}
                  </p>
                )}
                {details.responses && (
                  <div className="text-sm">
                    <strong>Responses:</strong>
                    <ul className="ml-4 mt-1">
                      {Object.entries(details.responses).map(([code, response]: [string, any]) => (
                        <li key={code}>
                          <span className="font-mono">{code}</span>: {response.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}